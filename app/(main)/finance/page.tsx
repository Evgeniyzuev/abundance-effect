'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ChevronDown, Sparkles, Target, Award, Brain, Heart, TrendingUp, Users, Shield, Globe } from 'lucide-react';

export default function FinancePage() {
  const router = useRouter();
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 4); // 4 steps in the sequence
    }, 1500); // Change every 1.5 seconds
    return () => clearInterval(interval);
  }, []);



  return (
    <div className="min-h-full bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-gray-100 overflow-x-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300">
              Экономика участия
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mt-6 text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Как ваша покупка либо углубляет кризис — либо создаёт изобилие для всех
          </motion.p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Comparison Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">

          {/* Traditional Business */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            whileHover={{ y: -8 }}
            className="relative rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl overflow-hidden"
          >
            {/* Glowing accent top bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-red-500/70 via-red-400/70 to-orange-400/70"></div>

            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-300 to-orange-300">
                  Старая модель
                </h2>
                <span className="px-3 py-1 bg-red-500/20 text-red-300 text-sm rounded-full border border-red-500/30">
                  Линейная экономика
                </span>
              </div>

              {/* Diagram */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative w-full max-w-md h-72 flex items-center justify-center">
                  {/* Question mark source */}
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0.6, 0.9, 0.6]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute left-0 top-1/2 -translate-y-1/2"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 border border-red-400/50 flex items-center justify-center shadow-lg">
                      <span className="text-white text-2xl font-bold">?</span>
                    </div>
                  </motion.div>

                  {/* Money flow line */}
                  <div className="absolute top-1/2 left-1/5 right-1/5 h-0.5 bg-gradient-to-r from-gray-500/30 via-gray-400/50 to-gray-500/30 -translate-y-1/2"></div>

                  {/* Customer */}
                  <motion.div
                    animate={{
                      scale: animationStep === 1 ? 0.7 : animationStep === 2 ? 0.6 : animationStep === 3 ? 0.5 : 1,
                    }}
                    transition={{
                      duration: 0.8,
                      ease: "easeInOut"
                    }}
                    className="absolute left-1/5 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/80 to-cyan-500/80 border border-blue-400/40 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      П
                    </div>
                    <p className="text-xs text-center mt-2 text-gray-400">Покупатель</p>
                  </motion.div>

                  {/* Business */}
                  <motion.div
                    animate={{
                      scale: animationStep === 2 ? 1.1 : animationStep === 3 ? 1.0 : 1,
                    }}
                    transition={{
                      duration: 0.8,
                      ease: "easeInOut"
                    }}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/80 to-teal-500/80 border border-emerald-400/40 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      Б
                    </div>
                    <p className="text-xs text-center mt-2 text-gray-400">Бизнес</p>
                  </motion.div>

                  {/* Beneficiary */}
                  <motion.div
                    animate={{
                      scale: animationStep === 3 ? 1.4 : 1,
                    }}
                    transition={{
                      duration: 0.8,
                      ease: "easeInOut"
                    }}
                    className="absolute right-1/5 top-1/2 translate-x-1/2 -translate-y-1/2"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/80 to-pink-500/80 border border-purple-400/40 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      Б
                    </div>
                    <p className="text-xs text-center mt-2 text-gray-400">Бенефициар</p>
                  </motion.div>

                  {/* Arrow from Question to Customer */}
                  <motion.svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    className="absolute left-1/10 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    animate={{
                      opacity: animationStep === 0 ? [0.3, 1, 0.3] : 0.3,
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: animationStep === 0 ? Infinity : 0,
                      ease: "easeInOut"
                    }}
                  >
                    <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>

                  {/* Arrow from Customer to Business */}
                  <motion.svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    className="absolute left-7/20 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    animate={{
                      opacity: animationStep === 1 ? [0.3, 1, 0.3] : 0.3,
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: animationStep === 1 ? Infinity : 0,
                      ease: "easeInOut"
                    }}
                  >
                    <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>

                  {/* Arrow from Business to Beneficiary */}
                  <motion.svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    className="absolute left-13/20 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    animate={{
                      opacity: animationStep === 3 ? [0.3, 1, 0.3] : 0.3,
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: animationStep === 3 ? Infinity : 0,
                      ease: "easeInOut"
                    }}
                  >
                    <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="#EC4899" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                </div>
              </div>

              {/* Problems list */}
              <div className="rounded-2xl bg-red-500/5 border border-red-500/15 p-5">
                <h3 className="font-bold text-lg text-red-300 mb-4 flex items-center">
                  <span className="mr-2">⚠️</span>
                  Последствия:
                </h3>
                <ul className="space-y-2.5">
                  {[
                    "Потеря денег навсегда",
                    "Рост неравенства",
                    "Безработица",
                    "Перепроизводство",
                    "Экономические кризисы",
                    "Монополизация",
                    "Лишние затраты на рекламу/лоббизм"
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-start text-gray-300"
                    >
                      <span className="text-red-400 mr-2 mt-1">•</span>
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Participation Business */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ y: -8 }}
            className="relative rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl overflow-hidden"
          >
            {/* Glowing accent top bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400/70 via-emerald-400/70 to-green-400/70"></div>

            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-emerald-300">
                  Новая модель
                </h2>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-sm rounded-full border border-emerald-500/30">
                  Экономика участия
                </span>
              </div>

              {/* Diagram */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative w-full max-w-md h-72 flex items-center justify-center">
                  {/* Left circle - Customer-Beneficiary */}
                  <motion.div
                    animate={{
                      scale: 1.2,
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut"
                    }}
                    className="absolute left-1/3 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  >
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500/90 to-cyan-500/90 border border-blue-400/50 flex items-center justify-center text-white font-bold text-xl shadow-2xl">
                      <div className="text-center">
                        <span>П</span><br />
                        <span className="text-sm">=</span><br />
                        <span>Б</span>
                      </div>
                    </div>
                    <p className="text-xs text-center mt-2 text-gray-400">Покупатель-Бенефициар</p>
                  </motion.div>

                  {/* Right circle - Business */}
                  <motion.div
                    animate={{
                      scale: 1.2,
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                    className="absolute right-1/3 top-1/2 translate-x-1/2 -translate-y-1/2"
                  >
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500/90 to-teal-500/90 border border-emerald-400/50 flex items-center justify-center text-white font-bold text-xl shadow-2xl">
                      <div className="text-center">
                        <span>Б</span><br />
                        <span className="text-sm">+</span><br />
                        <span>С</span>
                      </div>
                    </div>
                    <p className="text-xs text-center mt-2 text-gray-400">Бизнес + Сообщество</p>
                  </motion.div>

                  {/* Circular arrows with blinking */}
                  <motion.svg
                    width="200"
                    height="200"
                    viewBox="0 0 200 200"
                    className="absolute"
                    animate={{
                      rotate: [0, 360],
                      opacity: [0.4, 1, 0.4]
                    }}
                    transition={{
                      rotate: {
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear"
                      },
                      opacity: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                  >
                    {/* Top arrow (right direction) */}
                    <path
                      d="M75 75 Q110 40 145 75"
                      stroke="url(#topGradient)"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray="6,4"
                    />
                    <polygon points="140,70 152,75 140,80" fill="url(#topGradientFill)" />

                    {/* Bottom arrow (left direction) */}
                    <path
                      d="M145 145 Q110 180 75 145"
                      stroke="url(#bottomGradient)"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray="6,4"
                    />
                    <polygon points="80,150 68,145 80,140" fill="url(#bottomGradientFill)" />

                    {/* Gradients definitions */}
                    <defs>
                      <linearGradient id="topGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.8" />
                      </linearGradient>
                      <linearGradient id="bottomGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#0D9488" stopOpacity="0.8" />
                      </linearGradient>
                      <linearGradient id="topGradientFill" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#06B6D4" />
                      </linearGradient>
                      <linearGradient id="bottomGradientFill" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#0D9488" />
                      </linearGradient>
                    </defs>

                    {/* Dollar sign in center */}
                    <text x="110" y="115" textAnchor="middle" fontSize="28" fill="#E5E7EB" fontWeight="bold" opacity="0.9">$</text>
                  </motion.svg>
                </div>
              </div>

              {/* Benefits list */}
              <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/15 p-5">
                <h3 className="font-bold text-lg text-emerald-300 mb-4 flex items-center">
                  <span className="mr-2">✨</span>
                  Преимущества:
                </h3>
                <ul className="space-y-2.5">
                  {[
                    "Каждая покупка — инвестиция в себя",
                    "Рост общего благосостояния",
                    "Создание рабочих мест",
                    "Производство по реальному спросу",
                    "Экономическая устойчивость",
                    "Разнообразие и здоровая конкуренция",
                    "Минимизация ненужных затрат"
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-start text-gray-300"
                    >
                      <span className="text-emerald-400 mr-2 mt-1">•</span>
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        {/* AI & Automation Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl overflow-hidden"
        >
          <div className="h-1.5 w-full bg-gradient-to-r from-violet-500/70 via-fuchsia-500/70 to-pink-500/70"></div>
          <div className="p-8 md:p-12">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-300 via-fuchsia-300 to-pink-300">
                ИИ и Автоматизация: угроза или решение?
              </h2>
              <p className="text-lg text-gray-400 mt-4 max-w-3xl mx-auto">
                Технологии сами по себе нейтральны — всё зависит от экономической системы, в которой они работают
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Old Model AI */}
              <div className="rounded-2xl bg-red-500/5 border border-red-500/15 p-6">
                <div className="flex items-center mb-5">
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center mr-3">
                    <span className="text-red-300 font-bold">❌</span>
                  </div>
                  <h3 className="text-xl font-bold text-red-300">В старой модели</h3>
                </div>
                <ul className="space-y-3 text-gray-300">
                  {[
                    "ИИ заменяет людей → массовая безработица",
                    "Автоматизация увеличивает прибыль бенефициарам, но не обществу",
                    "Рост неравенства → социальное напряжение",
                    "Усиление контроля и манипуляций",
                    "Повышение риска системного коллапса",
                    "Люди превращаются в «лишних»"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-red-400 mr-2 mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* New Model AI */}
              <div className="rounded-2xl bg-violet-500/5 border border-violet-500/15 p-6">
                <div className="flex items-center mb-5">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center mr-3">
                    <span className="text-violet-300 font-bold">✅</span>
                  </div>
                  <h3 className="text-xl font-bold text-violet-300">В модели участия</h3>
                </div>
                <ul className="space-y-3 text-gray-300">
                  {[
                    "ИИ освобождает от рутины → больше свободного времени",
                    "Автоматизация снижает цены → изобилие для всех",
                    "Доходы от ИИ распределяются среди участников",
                    "Люди фокусируются на творчестве и развитии",
                    "Снижение рисков — система саморегулируется",
                    "Технологии служат людям, а не наоборот"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-violet-400 mr-2 mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30 text-center"
            >
              <p className="text-xl md:text-2xl font-bold text-violet-200">
                ИИ не уничтожает работу — он уничтожает <span className="text-red-300 line-through">старую модель</span>, чтобы раскрыть потенциал новой.
              </p>
              <p className="mt-3 text-lg text-gray-300">
                В экономике участия технологии делают нас лучше, свободнее и счастливее.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Core Principle */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="inline-block rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 p-8">
            <h3 className="text-2xl font-bold text-gray-200 mb-6">Суть трансформации</h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-4xl mb-3">📉👤💸 → 🏢 → 📛</div>
                <p className="text-gray-400">Вы отдаёте деньги навсегда — богатеет кто-то другой</p>
              </div>
              <div className="text-3xl hidden md:block">⇄</div>
              <div className="text-center">
                <div className="text-4xl mb-3">🔄📈👤 ⇄ 💰 ⇄ 🏢</div>
                <p className="text-gray-400">Вы участвуете — деньги возвращаются многократно</p>
              </div>
            </div>
          </div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            className="mt-12 max-w-3xl mx-auto p-6 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20"
          >
            <p className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-300">
              Каждый покупатель — это Бенефициар.<br />
              Каждая покупка — это инвестиция в будущее.
            </p>
            <p className="mt-6 text-xl text-gray-300">
              У вас есть свобода решать — не отдавайте её.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.back()}
              className="mt-6 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-full shadow-lg"
            >
              Покупайте у себя! 🌐
            </motion.button>
          </motion.div>
        </motion.div>
      </main>

      <footer className="py-8 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>Экономика участия — когда технологии служат человечеству, а не наоборот</p>
      </footer>
    </div>
  );
}
