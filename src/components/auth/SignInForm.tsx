import { useAuthActions } from "@convex-dev/auth/react"
import { useState } from "react"
import { toast } from "sonner"
import { Mail, Lock, UserPlus, LogIn } from "lucide-react"

export function SignInForm() {
  const { signIn } = useAuthActions()
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn")
  const [submitting, setSubmitting] = useState(false)

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">{flow === "signIn" ? "Welcome Back" : "Create Account"}</h2>
        <p className="text-slate-600 mt-1">
          {flow === "signIn" ? "Sign in to access your files" : "Sign up to start sharing files"}
        </p>
      </div>

      <form
        className="flex flex-col gap-4"
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
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Mail className="h-5 w-5 text-slate-400" />
          </div>
          <input
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
            type="email"
            name="email"
            placeholder="Email"
            required
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Lock className="h-5 w-5 text-slate-400" />
          </div>
          <input
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
            type="password"
            name="password"
            placeholder="Password"
            required
          />
        </div>

        <button
          className="flex items-center justify-center gap-2 w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors"
          type="submit"
          disabled={submitting}
        >
          {flow === "signIn" ? (
            <>
              <LogIn size={18} />
              <span>{submitting ? "Signing in..." : "Sign in"}</span>
            </>
          ) : (
            <>
              <UserPlus size={18} />
              <span>{submitting ? "Signing up..." : "Sign up"}</span>
            </>
          )}
        </button>

        <div className="text-center text-sm text-slate-600">
          <span>{flow === "signIn" ? "Don't have an account? " : "Already have an account? "}</span>
          <button
            type="button"
            className="text-purple-600 hover:text-purple-700 font-medium cursor-pointer"
            onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
          >
            {flow === "signIn" ? "Sign up instead" : "Sign in instead"}
          </button>
        </div>
      </form>

      <div className="flex items-center justify-center my-4">
        <hr className="grow border-slate-200" />
        <span className="mx-4 text-slate-400 text-sm">or</span>
        <hr className="grow border-slate-200" />
      </div>

      <button
        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 px-4 rounded-lg font-medium transition-colors"
        onClick={() => void signIn("anonymous")}
      >
        Sign in anonymously
      </button>
    </div>
  )
}
