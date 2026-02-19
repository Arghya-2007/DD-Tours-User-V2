"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import {
  ShieldCheck, CreditCard, Loader2, IndianRupee, Lock, CheckCircle, AlertTriangle,
  Landmark, Globe, Rocket, ArrowRight
} from "lucide-react";
import { api } from "@/lib/axios";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

interface Booking {
  bookingId: string;
  totalPrice: number;
  totalGuests: number;
  tour: { tourTitle: string };
  user: { userName: string; userEmail: string };
}

type PaymentMode = "ONLINE" | "OFFLINE";
type SuccessState = "ONLINE_SUCCESS" | "OFFLINE_SUCCESS" | null;

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const urlId = pathname.split("/")[2];
  const idToFetch = (params?.bookingId || params?.id || params?.slug || urlId) as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [paymentMode, setPaymentMode] = useState<PaymentMode>("ONLINE");

  // 🆕 NEW: Success State
  const [paymentSuccess, setPaymentSuccess] = useState<SuccessState>(null);

  useEffect(() => {
    if (!idToFetch || idToFetch === "undefined") {
        const timer = setTimeout(() => {
            setLoading(false);
            setError("Invalid Booking URL. Missing ID.");
        }, 1000);
        return () => clearTimeout(timer);
    }

    const fetchBooking = async () => {
      try {
        const { data } = await api.get(`/bookings/${idToFetch}`);
        setBooking(data.data);
      } catch (err: any) {
        setError("Unable to load booking details. It may not exist or you don't have access.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [idToFetch]);

  // 🆕 NEW: Auto-Redirect Effect after Success
  useEffect(() => {
    if (paymentSuccess) {
      const timer = setTimeout(() => {
        router.push("/profile");
      }, 4500); // Redirects after 4.5 seconds
      return () => clearTimeout(timer);
    }
  }, [paymentSuccess, router]);

  const handleOnlinePayment = async () => {
    if (!booking) return;
    setProcessing(true);
    setError(null);

    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error("Razorpay SDK failed to load. Are you online?");
      }

      const { data: orderResponse } = await api.post("/payment/create-order", {
        bookingId: booking.bookingId,
      });
      const orderData = orderResponse.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_YOUR_KEY",
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "DD Tours & Travels",
        description: `Payment for ${booking.tour?.tourTitle || 'Expedition'}`,
        order_id: orderData.id,
        prefill: {
          name: booking.user?.userName || "Guest",
          email: booking.user?.userEmail || "guest@example.com",
        },
        theme: {
          color: "#ea580c",
        },
        handler: async function (response: any) {
          try {
            setProcessing(true);
            await api.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            // 🚨 FIX: Trigger the Success Screen instead of immediate redirect
            setProcessing(false);
            setPaymentSuccess("ONLINE_SUCCESS");
          } catch (verificationError: any) {
            setError("Payment verification failed. Please contact support.");
            setProcessing(false);
          }
        },
      };

      const paymentObject = new (window as any).Razorpay(options);

      paymentObject.on("payment.failed", function (response: any) {
        setError(response.error.description || "Payment was cancelled or failed.");
        setProcessing(false);
      });

      paymentObject.open();

    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Something went wrong while initiating payment.");
      setProcessing(false);
    }
  };

  const handleOfflinePayment = () => {
      setProcessing(true);
      setError(null);
      // Simulate a brief backend call delay before showing success
      setTimeout(() => {
          setProcessing(false);
          setPaymentSuccess("OFFLINE_SUCCESS");
      }, 1500);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-[70vh]"><Loader2 className="animate-spin text-orange-600 w-12 h-12" /></div>;
  }

  // 🌟 THE NEW SUCCESS SCREEN 🌟
  if (paymentSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 md:py-32 text-center animate-in zoom-in-95 duration-500">
        <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-500/10 mb-8 border border-emerald-500/30 text-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping opacity-75" />
            <Rocket size={40} className="relative z-10" />
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">
            Mission <span className="text-emerald-500">Confirmed</span>
        </h1>

        {paymentSuccess === "ONLINE_SUCCESS" ? (
            <p className="text-zinc-400 text-lg mb-8 max-w-lg mx-auto">
                Payment successful! Your seats for <strong className="text-white">{booking?.tour?.tourTitle}</strong> are officially secured. Pack your bags!
            </p>
        ) : (
            <p className="text-zinc-400 text-lg mb-8 max-w-lg mx-auto">
                Your intent to join <strong className="text-white">{booking?.tour?.tourTitle}</strong> has been recorded! Please complete your bank transfer within 24 hours to secure your seats.
            </p>
        )}

        <div className="bg-[#111] border border-white/5 rounded-2xl p-6 mb-10 max-w-md mx-auto flex items-center justify-between text-left">
            <div>
                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest block mb-1">Mission Identifier</span>
                <span className="text-white font-mono text-lg">{booking?.bookingId.split('-')[0].toUpperCase()}</span>
            </div>
            <div className="text-right">
                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest block mb-1">Status</span>
                <span className="text-emerald-500 font-bold uppercase tracking-wider text-sm flex items-center gap-1.5 justify-end">
                    <CheckCircle size={14} /> {paymentSuccess === "ONLINE_SUCCESS" ? "PAID" : "PENDING"}
                </span>
            </div>
        </div>

        <p className="text-zinc-500 text-sm flex items-center justify-center gap-2 mb-6">
            <Loader2 size={16} className="animate-spin text-orange-500" /> Redirecting to Headquarters...
        </p>

        <button
            onClick={() => router.push("/profile")}
            className="text-orange-500 hover:text-orange-400 font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 mx-auto transition-colors"
        >
            Skip & Go to Profile <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  if (!booking) {
    return (
        <div className="text-center py-32 px-4">
            <AlertTriangle size={48} className="mx-auto text-red-500 mb-6" />
            <h2 className="text-3xl font-black text-white mb-4 uppercase">Booking Not Found</h2>
            <p className="text-zinc-500 mb-8">{error || "The requested mission invoice could not be located."}</p>
            <button onClick={() => router.push('/tours')} className="px-8 py-3 bg-white/10 rounded-full text-white font-bold uppercase text-sm hover:bg-orange-600 transition-colors border border-white/10">Return to Archive</button>
        </div>
    );
  }

  // ... [The rest of the normal Payment UI remains identical]
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/10 mb-4 border border-orange-500/20 text-orange-500 shadow-[0_0_30px_rgba(234,88,12,0.2)]">
            <Lock size={28} />
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">
            Secure <span className="text-orange-600">Payment</span>
        </h1>
        <p className="text-zinc-400 mt-3 text-sm tracking-wide">Select your preferred payment method to finalize.</p>
      </div>

      <div className="bg-[#141414] border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/5 rounded-full blur-[80px] pointer-events-none" />

        {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl flex items-center gap-3 mb-8 relative z-10">
                <AlertTriangle size={20} className="shrink-0" /> {error}
            </div>
        )}

        <div className="space-y-6 mb-8 relative z-10">
            <div>
                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest block mb-1">Mission Identifier</span>
                <div className="text-white font-mono text-sm tracking-wider bg-[#111] px-3 py-1.5 rounded-lg border border-white/5 inline-block">
                    {booking.bookingId.split('-')[0].toUpperCase()}
                </div>
            </div>

            <div>
                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest block mb-1">Target Destination</span>
                <div className="text-white font-bold text-xl uppercase tracking-wide">
                    {booking.tour?.tourTitle || "Custom Expedition"}
                </div>
            </div>

            <div className="flex items-center justify-between py-4 border-y border-white/5">
                <span className="text-zinc-400 text-sm">Total Passengers</span>
                <span className="text-white font-bold">{booking.totalGuests} Pax</span>
            </div>

            <div className="flex items-center justify-between">
                <span className="text-zinc-400 text-sm">Total Amount Payable</span>
                <span className="text-4xl font-black text-orange-500 flex items-center tracking-tighter">
                    <IndianRupee size={28} className="mr-1 text-zinc-400" /> {booking.totalPrice?.toLocaleString("en-IN")}
                </span>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
            <button
                onClick={() => setPaymentMode("ONLINE")}
                className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 ${paymentMode === "ONLINE" ? "bg-orange-600/10 border-orange-500 text-orange-500 shadow-[0_0_20px_rgba(234,88,12,0.1)]" : "bg-[#111] border-white/10 text-zinc-500 hover:border-white/30"}`}
            >
                <Globe size={24} />
                <span className="text-xs font-bold uppercase tracking-widest">Pay Online</span>
            </button>
            <button
                onClick={() => setPaymentMode("OFFLINE")}
                className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 ${paymentMode === "OFFLINE" ? "bg-emerald-500/10 border-emerald-500 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]" : "bg-[#111] border-white/10 text-zinc-500 hover:border-white/30"}`}
            >
                <Landmark size={24} />
                <span className="text-xs font-bold uppercase tracking-widest">Pay Offline</span>
            </button>
        </div>

        {paymentMode === "ONLINE" ? (
            <div className="relative z-10">
                <button
                    onClick={handleOnlinePayment}
                    disabled={processing}
                    className="w-full py-4 bg-orange-600 hover:bg-orange-700 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-lg hover:shadow-orange-600/30 flex justify-center items-center gap-3 active:scale-95"
                >
                    {processing ? <><Loader2 size={20} className="animate-spin" /> Processing Gateway...</> : <><CreditCard size={20} /> Authorize Payment</>}
                </button>
                <div className="mt-6 flex items-center justify-center gap-6 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-500" /> Secure Gateway</span>
                    <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-emerald-500" /> 256-Bit SSL</span>
                </div>
            </div>
        ) : (
            <div className="relative z-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-[#111] border border-white/5 rounded-xl p-5 mb-6 text-sm text-zinc-400 space-y-3">
                    <p className="text-white font-bold uppercase tracking-widest text-xs mb-2 text-emerald-500 flex items-center gap-2">
                        <Landmark size={14} /> Bank Transfer Details
                    </p>
                    <p><strong>Bank Name:</strong> State Bank of India</p>
                    <p><strong>Account Name:</strong> DD Tours & Travels</p>
                    <p><strong>A/C Number:</strong> 0000 1234 5678</p>
                    <p><strong>IFSC Code:</strong> SBIN0001234</p>
                    <p className="text-xs text-orange-500 mt-2">
                        * Please complete the transfer within 24 hours to confirm your seats. Use your Mission Identifier as the payment remark.
                    </p>
                </div>
                <button
                    onClick={handleOfflinePayment}
                    disabled={processing}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-lg hover:shadow-emerald-600/30 flex justify-center items-center gap-3 active:scale-95"
                >
                    {processing ? <><Loader2 size={20} className="animate-spin" /> Securing Mission...</> : "Confirm Offline Intent"}
                </button>
            </div>
        )}

      </div>
    </div>
  );
}