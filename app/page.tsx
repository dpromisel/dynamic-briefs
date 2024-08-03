"use client";

import { useState } from "react";
import { useChat, useCompletion } from "ai/react";
import { RocketIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectOrCreate } from "@/components/ui/select-or-create";
import { Textarea } from "@/components/ui/textarea";
import { server } from "@/lib/trpc/server";

type Product = {
  name: string;
  description: string;
};

type Brand = {
  name: string;
  usp: string;
  products: Product[];
  hooks: string[];
  creatorTypes: string[];
};

const brandsData: Brand[] = [
  {
    name: "EcoGear Outdoors",
    usp: "Sustainable outdoor equipment made from recycled materials",
    products: [
      {
        name: "RecycleHike Backpack",
        description: "Durable backpack made from recycled plastic bottles",
      },
      {
        name: "SolarCamp Tent",
        description: "Lightweight tent with integrated solar panels for power",
      },
      {
        name: "EcoTrail Hiking Boots",
        description: "Comfortable hiking boots made from sustainable materials",
      },
    ],
    hooks: [
      "Discover how our products help you explore nature responsibly",
      "Join the eco-friendly outdoor revolution",
      "Adventure awaits with gear that cares for the planet",
    ],
    creatorTypes: [
      "Outdoor enthusiast",
      "Eco-conscious traveler",
      "Hiking expert",
    ],
  },
  {
    name: "NutriTech Foods",
    usp: "Personalized nutrition solutions using AI-driven analysis",
    products: [
      {
        name: "CustomBlend Protein Powder",
        description:
          "AI-formulated protein powder tailored to individual needs",
      },
      {
        name: "SmartMeal Prep Kits",
        description: "Personalized meal kits based on nutritional requirements",
      },
      {
        name: "NutriScan DNA Test Kit",
        description: "DNA testing kit for personalized nutrition advice",
      },
    ],
    hooks: [
      "Unlock your body's potential with AI-powered nutrition",
      "Discover the future of personalized eating",
      "Transform your diet with science-backed meal plans",
    ],
    creatorTypes: [
      "Fitness influencer",
      "Nutrition expert",
      "Health and wellness coach",
    ],
  },
  {
    name: "SleepWell Innovations",
    usp: "Sleep optimization products backed by sleep science research",
    products: [
      {
        name: "BioRhythm Smart Mattress",
        description: "Mattress that adapts to sleep patterns for optimal rest",
      },
      {
        name: "CircadianLight Alarm Clock",
        description: "Alarm clock that simulates natural light cycles",
      },
      {
        name: "REM-Tracker Sleep Mask",
        description: "Sleep mask that monitors and optimizes REM sleep",
      },
    ],
    hooks: [
      "Wake up refreshed every day with sleep science",
      "Revolutionize your nights for better days",
      "Unlock the secrets to perfect sleep",
    ],
    creatorTypes: ["Sleep coach", "Productivity guru", "Wellness influencer"],
  },
  {
    name: "QuickFix Home Solutions",
    usp: "DIY home repair kits with augmented reality tutorials",
    products: [
      {
        name: "AR Plumbing Assistant Kit",
        description: "Plumbing toolkit with AR-guided repair instructions",
      },
      {
        name: "Virtual Electrician Toolkit",
        description: "Electrical repair kit with virtual assistance",
      },
      {
        name: "SmartPaint Color Matcher",
        description: "Paint matching tool with AR color preview",
      },
    ],
    hooks: [
      "Become a DIY pro with AR-guided repairs",
      "Fix it yourself with confidence using our smart tools",
      "Transform your home repairs with cutting-edge tech",
    ],
    creatorTypes: [
      "DIY enthusiast",
      "Home improvement expert",
      "Tech-savvy homeowner",
    ],
  },
  {
    name: "PetPal Tech",
    usp: "Smart pet care products for the modern pet owner",
    products: [
      {
        name: "AI Pet Feeder",
        description: "Automated feeder with portion control and scheduling",
      },
      {
        name: "GPS Collar with Health Monitoring",
        description: "Pet collar that tracks location and vital signs",
      },
      {
        name: "Interactive Pet Toy Robot",
        description: "AI-powered toy that adapts to your pet's play style",
      },
    ],
    hooks: [
      "Give your pet the smart care they deserve",
      "Stay connected with your furry friend, even when apart",
      "Elevate your pet parenting with cutting-edge tech",
    ],
    creatorTypes: [
      "Pet influencer",
      "Veterinary professional",
      "Tech-savvy pet owner",
    ],
  },
];

export default function Chat() {
  const { completion, input, setInput, handleSubmit } = useCompletion({
    api: "/api/completion",
  });

  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedHook, setSelectedHook] = useState<string>("");
  const [selectedCreatorType, setSelectedCreatorType] = useState<string>("");

  const handleBrandChange = (value: string) => {
    const brand = brandsData.find((b) => b.name === value) || null;
    setSelectedBrand(brand);
    setSelectedProduct(null);
    setSelectedHook("");
    setSelectedCreatorType("");
  };

  const handleProductChange = (value: string) => {
    const product =
      selectedBrand?.products.find((p) => p.name === value) || null;
    setSelectedProduct(product);
  };
  const handleHookChange = (value: string) => {
    setSelectedHook(value);
    if (!selectedBrand?.hooks.includes(value)) {
      setSelectedBrand((prev) =>
        prev ? { ...prev, hooks: [...prev.hooks, value] } : null,
      );
    }
  };

  const handleCreatorTypeChange = (value: string) => {
    setSelectedCreatorType(value);
    if (!selectedBrand?.creatorTypes.includes(value)) {
      setSelectedBrand((prev) =>
        prev ? { ...prev, creatorTypes: [...prev.creatorTypes, value] } : null,
      );
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !selectedBrand ||
      !selectedProduct ||
      !selectedHook ||
      !selectedCreatorType
    ) {
      alert("Please select all options.");
      return;
    }

    setInput(
      `
      Generate a script for an ad for the following brand:

      Brand: ${selectedBrand.name}
      Product: ${selectedProduct.name}
      Hook: ${selectedHook}
      Creator Type: ${selectedCreatorType}
    `,
    );

    handleSubmit();
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 p-4">
      <p className="text-2xl font-bold">Dynamic Briefs</p>
      <p className="text-sm text-gray-500">
        Select a brand, product, hook, and creator type to generate a brand
        intro.
      </p>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <Select onValueChange={handleBrandChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a brand" />
          </SelectTrigger>
          <SelectContent>
            {brandsData.map((brand) => (
              <SelectItem key={brand.name} value={brand.name}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedBrand && (
          <Alert>
            <RocketIcon className="h-4 w-4" />
            <AlertTitle>{selectedBrand.name}</AlertTitle>
            <AlertDescription>{selectedBrand.usp}</AlertDescription>
          </Alert>
        )}

        <Select onValueChange={handleProductChange} disabled={!selectedBrand}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a product or service" />
          </SelectTrigger>
          <SelectContent>
            {selectedBrand?.products.map((product) => (
              <SelectItem key={product.name} value={product.name}>
                {product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedProduct && (
          <Alert>
            <RocketIcon className="h-4 w-4" />
            <AlertTitle>{selectedProduct.name}</AlertTitle>
            <AlertDescription>{selectedProduct.description}</AlertDescription>
          </Alert>
        )}

        <SelectOrCreate
          options={selectedBrand?.hooks || []}
          placeholder="Select or create a hook"
          onValueChange={handleHookChange}
          disabled={!selectedBrand}
        />

        <SelectOrCreate
          options={selectedBrand?.creatorTypes || []}
          placeholder="Select or create a creator type"
          onValueChange={handleCreatorTypeChange}
          disabled={!selectedBrand}
        />

        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>

      <div className="mt-10">{completion}</div>
    </div>
  );
}
