import React, { useState, useEffect } from "react";
import {
  Camera,
  Layers,
  Wand2,
  Crop,
  Type,
  Droplets,
  Maximize,
  Highlighter,
  Sparkle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const LandingPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [primaryImage, setPrimaryImage] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const { user, login, register } = useAuth();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <Layers className="w-8 h-8" />,
      title: "Background Magic",
      description: "Remove & replace backgrounds with AI-generated scenes.",
    },
    {
      icon: <Wand2 className="w-8 h-8" />,
      title: "Monochrome Mastery",
      description: "Transform photos into stunning black & white masterpieces.",
    },
    {
      icon: <Droplets className="w-8 h-8" />,
      title: "Color Splash",
      description: "Bring focus with selective color highlighting.",
    },
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Smart Enhance",
      description: "Perfect your photos with AI-powered adjustments.",
    },
    {
      icon: <Type className="w-8 h-8" />,
      title: "Cartoonify",
      description: "Transform images into lively cartoon artwork.",
    },
    {
      icon: <Crop className="w-8 h-8" />,
      title: "Focus Effects",
      description: "Add depth with selective blur and focus.",
    },
    {
      icon: <Maximize className="w-8 h-8" />,
      title: "Smart Resize",
      description: "Resize and crop while preserving quality.",
    },
    {
      icon: <Highlighter className="w-8 h-8" />,
      title: "Watermark Pro",
      description: "Protect your work with custom watermarks.",
    },
  ];

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleRegisterClick = () => {
    setShowRegister(true);
  };

  const closeModal = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, files } = e.target;

    if (files && files.length > 0) {
      if (id === "picture") {
        setPrimaryImage(files[0]);
      }
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      setShowLogin(false);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!primaryImage) {
      toast("Please add your avatar!");
      return;
    }

    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        primaryImage
      );
      setShowRegister(false);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div
      className={`min-h-screen bg-gray-100 text-gray-900 transition duration-300 ${
        showLogin || showRegister ? "overflow-hidden" : ""
      }`}
    >
      <header className="bg-white shadow-md p-4 fixed w-full z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center">
            <Sparkle className="w-8 h-8 mr-2 text-blue-600" />
            EditGenie
          </h1>
          <div className="space-x-4">
            <button
              onClick={handleLoginClick}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full transition duration-300 transform hover:scale-105"
            >
              Login
            </button>
            <button
              onClick={handleRegisterClick}
              className="bg-gray-300 hover:bg-gray-200 text-blue-800 px-6 py-2 rounded-full transition duration-300 transform hover:scale-105"
            >
              Register
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-24 pb-12">
        <section
          className={`text-center mb-20 transition-opacity duration-1000 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <h2 className="text-5xl font-bold mb-6 leading-tight">
            Unleash Your Creative Magic with AI-Powered Editing
          </h2>
          <p className="text-2xl mb-10 text-gray-600">
            Transform ordinary images into extraordinary masterpieces
          </p>
          <button className="bg-blue-600 hover:bg-blue-500 text-white text-xl px-10 py-4 rounded-full transition duration-300 transform hover:scale-110 hover:shadow-lg">
            Start Editing for Free
          </button>
        </section>

        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105 ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="text-blue-300 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-700">{feature.description}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="bg-white shadow-md py-8 mt-12">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 EditGenie. Empowering creativity with AI magic.</p>
        </div>
      </footer>

      <Dialog open={showLogin} onOpenChange={() => setShowLogin(false)}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-3xl mb-4">Login</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleLogin}>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email" className="ml-1">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                placeholder="johndoe@example.com"
                className="mb-4 bg-gray-200 border-0 h-12 text-lg focus:ring-2 focus:ring-blue-400"
                required
                onChange={handleInputChange}
              />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="password" className="ml-1">
                Password
              </Label>
              <Input
                type="password"
                id="password"
                placeholder="pass@123"
                className="mb-4 bg-gray-200 border-0 h-12 text-lg focus:ring-2 focus:ring-blue-400"
                required
                onChange={handleInputChange}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white mt-7 text-xl font-semibold"
            >
              Login
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showRegister} onOpenChange={() => setShowRegister(false)}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-3xl mb-4">Register</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRegister}>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="name" className="ml-1">
                Full Name
              </Label>
              <Input
                type="text"
                id="name"
                placeholder="John Doe"
                className="mb-4 bg-gray-200 border-0 h-12 text-lg focus:ring-2 focus:ring-blue-400"
                required
                onChange={handleInputChange}
              />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email" className="ml-1">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                placeholder="johndoe@example.com"
                className="mb-4 bg-gray-200 border-0 h-12 text-lg focus:ring-2 focus:ring-blue-400"
                required
                onChange={handleInputChange}
              />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="password" className="ml-1">
                Password
              </Label>
              <Input
                type="password"
                id="password"
                placeholder="pass@123"
                className="mb-4 bg-gray-200 border-0 h-12 text-lg focus:ring-2 focus:ring-blue-400"
                required
                onChange={handleInputChange}
              />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="picture" className="ml-1">
                Your Avatar
              </Label>
              <Input
                id="picture"
                type="file"
                className="mb-4 bg-gray-200 border-0 h-12 text-lg focus:ring-2 focus:ring-blue-400"
                onChange={handleInputChange}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white mt-7 text-xl font-semibold"
            >
              Register
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LandingPage;
