import { useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/authContext";

import schoolOfBusiness from "../../assets/school-of-business.png";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = login(email, password);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error ?? "Login failed.");
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full overflow-hidden" style={{ height: "480px" }}>
      <img
        src={schoolOfBusiness}
        alt="KCAU Virtual Campus"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      <div className="relative z-10 flex items-center justify-center w-full h-full px-4">
        <Card className="w-full max-w-sm shadow-2xl border-0 rounded-xl overflow-hidden">

          <div className="h-1.5 w-full bg-[#c9a227]" />

          <CardHeader className="pb-2 pt-5 px-6">
            <CardTitle className="text-lg font-black text-[#1a2a5e] tracking-tight">
              Log in to KCAU LMS
            </CardTitle>
          </CardHeader>

          <CardContent className="px-6 pb-6 pt-1">
            {/* Error message */}
            {error && (
              <div className="mb-3 px-3 py-2 rounded-md bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-3">
              {/* Email */}
              <div className="space-y-1">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@kcau.ac.ke"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-10 border-gray-200 focus:border-[#c9a227] rounded-lg text-sm"
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-10 border-gray-200 focus:border-[#c9a227] rounded-lg text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1a2a5e] transition-colors"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Forgot */}
              <div className="flex justify-end">
                <a href="/forgot-password" className="text-xs text-[#c9a227] font-semibold hover:underline">
                  Forgot password?
                </a>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-[#1a2a5e] hover:bg-[#132047] text-white font-bold rounded-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Logging in...
                  </>
                ) : (
                  <><LogIn size={15} /> Log In</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;