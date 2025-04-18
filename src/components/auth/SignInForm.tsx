
import { useAuthActions } from "@convex-dev/auth/react"
import { useState } from "react"
import { toast } from "sonner"
import { Mail, Lock, UserPlus, LogIn, User } from "lucide-react"

export function SignInForm() {
  const { signIn } = useAuthActions()
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn")
  const [submitting, setSubmitting] = useState(false)

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <div className="inline-flex p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full shadow-lg mb-5">
          <div className="bg-white p-3 rounded-full">
            {flow === "signIn" ? (
              <LogIn className="h-6 w-6 text-indigo-600" />
            ) : (
              <UserPlus className="h-6 w-6 text-indigo-600" />
            )}
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          {flow === "signIn" ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="text-slate-600">
          {flow === "signIn" ? "Sign in to access your files" : "Sign up to start sharing files"}
        </p>
      </div>

      <form
        className="flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault()
          setSubmitting(true)
          const formData = new FormData(e.target as HTMLFormElement)
          formData.set("flow", flow)
          void signIn("password", formData).catch((_error) => {
            const toastTitle =
              flow === "signIn"
                ? "Could not sign in, did you mean to sign up?"
                : "Could not sign up, did you mean to sign in?"
            toast.error(toastTitle)
            setSubmitting(false)
          })
        }}
      >
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
          </div>
          <input
            className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all duration-200"
            type="email"
            name="email"
            placeholder="Email"
            required
          />
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
          </div>
          <input
            className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all duration-200"
            type="password"
            name="password"
            placeholder="Password"
            required
          />
        </div>

        <button
          className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3.5 px-4 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 mt-2"
          type="submit"
          disabled={submitting}
        >
          {flow === "signIn" ? (
            <>
              <LogIn size={18} className="animate-pulse" />
              <span>{submitting ? "Signing in..." : "Sign in"}</span>
            </>
          ) : (
            <>
              <UserPlus size={18} className="animate-pulse" />
              <span>{submitting ? "Signing up..." : "Sign up"}</span>
            </>
          )}
        </button>

        <div className="text-center text-sm text-slate-600 mt-2">
          <span>{flow === "signIn" ? "Don't have an account? " : "Already have an account? "}</span>
          <button
            type="button"
            className="text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer hover:underline transition-colors"
            onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
          >
            {flow === "signIn" ? "Sign up instead" : "Sign in instead"}
          </button>
        </div>
      </form>

      <div className="flex items-center justify-center my-6">
        <hr className="grow border-slate-200" />
        <span className="mx-4 text-slate-400 text-sm font-medium px-3 py-1 bg-slate-50 rounded-full">or</span>
        <hr className="grow border-slate-200" />
      </div>

      <button
        className="w-full flex items-center justify-center gap-2 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 py-3.5 px-4 rounded-xl font-medium shadow-sm hover:shadow transition-all duration-200"
        onClick={() => void signIn("anonymous")}
      >
        <User size={18} className="text-slate-500" />
        <span>Sign in anonymously</span>
      </button>
    </div>
  )
}
