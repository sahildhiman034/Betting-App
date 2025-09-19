import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";

const ALLOWED_EMAILS = ["sumit@codebrew.com", "sumitcodebrew@gmail.com"]; 
const HARDCODED_PASSWORD = "12345678";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const existing = localStorage.getItem("arena_auth");
    if (existing) navigate("/");
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (ALLOWED_EMAILS.includes(email) && password === HARDCODED_PASSWORD) {
        const user = { name: "Sumit", balance: 1000 };
        localStorage.setItem("arena_auth", JSON.stringify(user));
        toast({ title: "Logged in", description: "Welcome to ArenaX" });
        navigate("/");
        return;
      }
      toast({ title: "Invalid credentials", description: "Please try again", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-primary"><span className="align-top">ARENA</span><span className="text-3xl ml-1">X</span></h1>
          <p className="text-sm text-muted-foreground">Login to continue</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-3">
          <div>
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Logging in..." : "Login"}</Button>
        </form>
        <div className="flex items-center justify-between mt-4">
          <Button
            type="button"
            variant="outline"
            className="text-xs"
            onClick={() => { setEmail(ALLOWED_EMAILS[0]); setPassword(HARDCODED_PASSWORD); }}
          >
            Use demo credentials
          </Button>
          <span className="text-[10px] text-muted-foreground">{ALLOWED_EMAILS[0]} / {HARDCODED_PASSWORD}</span>
        </div>
        <div className="text-center mt-3">
          <Link to="/" className="text-xs text-muted-foreground hover:underline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;


