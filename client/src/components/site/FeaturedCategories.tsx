"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/axios";
import { Category } from "@/types/category";
import CategoryCard from "./CategoryCard";
import EmptyState from "../ui/EmptyState";
import { LayoutGrid } from "lucide-react";

export default function FeaturedCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get<Category[]>("/categories")
      .then((res) => setCategories(res.data.slice(0, 6)))
      .catch(() => setCategories([]))
      .finally(() => setIsLoading(false));
  }, []);

  if (!isLoading && categories.length === 0) return null;

  return (
    <section className="bg-ink-100 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex items-end justify-between"
        >
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-brand-600">
              دسته‌بندی‌ها
            </p>
            <h2 className="text-2xl font-black text-ink-900">
              جستجو بر اساس نیاز
            </h2>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-lg bg-ink-800/5"
              />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <EmptyState icon={LayoutGrid} title="دسته‌بندی‌ای ثبت نشده" />
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((category, index) => (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
              >
                <CategoryCard category={category} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
