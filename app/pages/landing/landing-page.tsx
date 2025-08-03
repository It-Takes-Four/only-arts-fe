import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Palette,
  Users,
  Shield,
  Sparkles,
  Eye,
  Heart,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router";
import { useRef, useEffect, useState } from "react";
import { FullLogo, IconLogo } from "app/components/common/logo";
import { ThemeSwitcher } from "app/components/common/theme-switcher";
import { BackgroundBeams } from "@/components/blocks/Backgrounds/BackgroundBeams";
import StaticGradient from "@/components/blocks/Backgrounds/StaticGradient/StaticGradient";

const features = [
  {
    icon: Palette,
    title: "Mint & Showcase",
    description:
      "Easily mint your artwork as NFTs and present them in immersive, customizable galleries.",
    color: "from-purple-400 to-pink-400",
  },
  {
    icon: Users,
    title: "Decentralized Community",
    description:
      "Engage with a global network of artists and collectors through Web3-powered social and collaborative tools.",
    color: "from-blue-400 to-cyan-400",
  },
  {
    icon: Shield,
    title: "Blockchain Security",
    description:
      "Ensure authenticity and ownership with smart contracts, on-chain provenance, and decentralized storage.",
    color: "from-green-400 to-emerald-400",
  },
  {
    icon: TrendingUp,
    title: "Monetize with Web3",
    description:
      "Connect your wallet, create tokenized art, and generate income securely through decentralized sales and royalties.",
    color: "from-orange-400 to-red-400",
  },
];

const stats = [
  { number: "10K+", label: "Active Artists", icon: Users },
  { number: "50K+", label: "Artworks", icon: Palette },
  { number: "100K+", label: "Art Lovers", icon: Heart },
  { number: "1M+", label: "Views Daily", icon: Eye },
];

const AnimatedCounter = ({
  end,
  duration = 2,
}: {
  end: string;
  duration?: number;
}) => {
  const [count, setCount] = useState("0");
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView && !isInView) {
      setIsInView(true);

      // Extract number from string like "10K+" -> 10
      const numericValue = parseInt(end.replace(/[^0-9]/g, ""));
      const suffix = end.replace(/[0-9]/g, "");

      let startTime: number;

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min(
          (currentTime - startTime) / (duration * 1000),
          1
        );

        const currentCount = Math.floor(progress * numericValue);
        setCount(currentCount + suffix);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [inView, end, duration, isInView]);

  return <span ref={ref}>{count}</span>;
};

const FeatureCard = ({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
    >
      <Card className="group relative overflow-hidden border-0 bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all duration-500 h-full">
        <CardContent className="p-8">
          {/* Animated gradient background */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
          />

          {/* Icon with animated background */}
          <div className="relative mb-6">
            <motion.div
              className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} p-0.5`}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <div className="w-full h-full bg-background rounded-[14px] flex items-center justify-center">
                <feature.icon className="w-8 h-8 text-foreground" />
              </div>
            </motion.div>
          </div>

          <h3 className="text-xl font-bold mb-4 text-foreground">
            {feature.title}
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {feature.description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const StatCard = ({
  stat,
  index,
}: {
  stat: (typeof stats)[0];
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
      className="text-center group"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-background/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 hover:border-border transition-all duration-300"
      >
        <div className="flex justify-center mb-3">
          <stat.icon className="w-8 h-8 text-primary" />
        </div>
        <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
          <AnimatedCounter end={stat.number} />
        </div>
        <p className="text-sm text-muted-foreground font-medium">
          {stat.label}
        </p>
      </motion.div>
    </motion.div>
  );
};

export function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroRef, { once: true });

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <BackgroundBeams />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between p-6 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/" className="flex items-center space-x-2">
            <IconLogo className="h-8 md:hidden" />
            <FullLogo className="hidden md:block h-10" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center gap-4"
        >
          <ThemeSwitcher />
          <Link to="/login">
            <Button variant="ghost" className="font-medium cursor-pointer">
              Sign In
            </Button>
          </Link>
          <Link to="/register">
            <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium shadow-lg cursor-pointer">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative z-10 pt-20 pb-32 px-6">
        <div className="container mx-auto text-center max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={
              isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="mb-8"
          >
            <Badge
              variant="outline"
              className="mb-6 px-4 py-2 bg-background/50 backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              The Web3 Platform for Digital Artists
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                Empowering Artists
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Through Web3
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              OnlyArts is a Web3-native platform where digital artists mint,
              manage, and monetize their work using blockchain, smart contracts,
              and decentralized identity.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={
              isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.6, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Link to="/register">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                Start Creating Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/explore">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 bg-background/50 backdrop-blur-sm hover:bg-background/80 border-2 hover:border-primary/50 transition-all duration-300 cursor-pointer"
              >
                Explore Gallery
                <Eye className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>

          {/* Hero Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={
              isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.8, delay: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <StatCard key={stat.label} stat={stat} index={index} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 px-6 bg-background/30 backdrop-blur-sm">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <Badge
              variant="outline"
              className="mb-6 px-4 py-2 bg-background/50 backdrop-blur-sm"
            >
              <Palette className="w-4 h-4 mr-2" />
              Built for Web3 Creators
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              The Tools You Need to
              <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                {" "}
                Thrive on Chain
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From minting NFTs to managing royalties, OnlyArts gives you full
              creative control and ownership through secure blockchain
              integrations.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                feature={feature}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 rounded-3xl p-12 border border-primary/20 backdrop-blur-sm"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Bring Your Art to
              <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                {" "}
                Web3
              </span>
              ?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join a decentralized future where your art is truly yours. Mint,
              share, and sell with full ownership and transparency.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/register">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                >
                  Create Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 cursor-pointer"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 bg-background/50 backdrop-blur-sm py-12 px-6">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <FullLogo className="h-10 mx-auto mb-4" />
            <p className="text-muted-foreground max-w-md mx-auto">
              OnlyArts empowers digital creators with Web3 technology—mint,
              share, and monetize your art on your terms.
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2025 OnlyArts. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
