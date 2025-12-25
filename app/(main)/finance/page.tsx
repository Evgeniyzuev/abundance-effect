'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ChevronDown, Sparkles, Target, Award, Brain, Heart, TrendingUp, Users, Shield, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function FinancePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 4);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-full bg-gray-50 text-gray-900 overflow-x-hidden pt-safe">
      {/* Subtle light background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="relative pt-12 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900"
          >
            {t('finance.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl mt-4 text-gray-500 max-w-2xl mx-auto"
          >
            {t('finance.hero_subtitle')}
          </motion.p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Comparison Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

          {/* Traditional Business */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
          >
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{t('finance.old_model_title')}</h2>
                  <p className="text-sm text-gray-500 mt-1">{t('finance.old_model_subtitle')}</p>
                </div>
                <div className="p-2 bg-red-50 rounded-xl">
                  <Shield className="w-5 h-5 text-red-500" />
                </div>
              </div>

              {/* Diagram */}
              <div className="h-64 relative mb-8 bg-gray-50/50 rounded-2xl border border-gray-100/50 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-around px-4">

                  {/* Buyer */}
                  <div className="flex flex-col items-center gap-3 z-10">
                    <motion.div
                      animate={{
                        scale: animationStep === 1 ? 0.9 : animationStep === 2 ? 0.8 : animationStep === 3 ? 0.7 : 1,
                        filter: animationStep > 0 ? 'grayscale(0.5)' : 'grayscale(0)'
                      }}
                      className="w-16 h-16 rounded-2xl bg-white shadow-md border border-gray-100 flex items-center justify-center text-2xl"
                    >
                      👤
                    </motion.div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{t('finance.buyer')}</span>
                  </div>

                  {/* Business */}
                  <div className="flex flex-col items-center gap-3 z-10">
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-md border border-gray-100 flex items-center justify-center text-2xl">
                      🏢
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{t('finance.business')}</span>
                  </div>

                  {/* Beneficiary */}
                  <div className="flex flex-col items-center gap-3 z-10">
                    <motion.div
                      animate={{
                        scale: animationStep === 3 ? 1.3 : 1,
                        boxShadow: animationStep === 3 ? '0 0 20px rgba(168, 85, 247, 0.2)' : '0 0 0px rgba(168, 85, 247, 0)'
                      }}
                      className="w-16 h-16 rounded-2xl bg-white shadow-md border border-gray-100 flex items-center justify-center text-2xl"
                    >
                      👑
                    </motion.div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{t('finance.beneficiary')}</span>
                  </div>
                </div>

                {/* Money Particles */}
                <AnimatePresence>
                  {animationStep === 1 && (
                    <motion.div
                      initial={{ left: '25%', opacity: 0 }}
                      animate={{ left: '50%', opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute top-1/2 -translate-y-1/2 text-xl z-20"
                    >
                      💵
                    </motion.div>
                  )}
                  {animationStep === 2 && (
                    <motion.div
                      initial={{ left: '50%', opacity: 0 }}
                      animate={{ left: '75%', opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute top-1/2 -translate-y-1/2 text-xl z-20"
                    >
                      💰
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* The "Dead End" indicator */}
                <motion.div
                  animate={{ opacity: animationStep === 3 ? 1 : 0 }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center"
                >
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500 font-bold text-lg">!</div>
                  <span className="text-[8px] text-red-500 font-bold mt-1">{t('finance.dead_end')}</span>
                </motion.div>
              </div>

              {/* Problems list */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-gray-900 flex items-center">
                  {t('finance.consequences_title')}
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    t('finance.consequence_1'),
                    t('finance.consequence_2'),
                    t('finance.consequence_3'),
                    t('finance.consequence_4')
                  ].map((item, index) => (
                    <div key={index} className="flex gap-3 items-start text-sm text-gray-600 p-3 bg-red-50/50 rounded-xl">
                      <span className="text-red-500 mt-0.5">✕</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Participation Business */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
          >
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{t('finance.new_model_title')}</h2>
                  <p className="text-sm text-emerald-600 mt-1">{t('finance.new_model_subtitle')}</p>
                </div>
                <div className="p-2 bg-emerald-50 rounded-xl">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                </div>
              </div>

              {/* Diagram */}
              <div className="h-64 relative mb-8 bg-emerald-50/20 rounded-2xl border border-emerald-100/50 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center gap-12 px-4">

                  {/* Buyer = Beneficiary (Infinite Loop Side) */}
                  <div className="flex flex-col items-center gap-3 z-10">
                    <motion.div
                      animate={{
                        scale: [1, 1.05, 1],
                        rotate: [0, 5, 0, -5, 0]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="w-20 h-20 rounded-full bg-white shadow-lg border-2 border-emerald-100 flex items-center justify-center text-3xl relative"
                    >
                      👤
                      <div className="absolute -right-1 -top-1 bg-emerald-500 text-[10px] text-white px-1.5 py-0.5 rounded-full font-bold">
                        {t('finance.beneficiary_badge')}
                      </div>
                    </motion.div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{t('finance.i_business')}</span>
                  </div>

                  {/* Infinite Symbol or Flow */}
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-2 border-dashed border-emerald-200 rounded-full"
                    />
                    <span className="text-2xl text-emerald-500">⇄</span>
                  </div>

                  {/* Community / Marketplace */}
                  <div className="flex flex-col items-center gap-3 z-10">
                    <motion.div
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="w-20 h-20 rounded-3xl bg-white shadow-lg border border-emerald-50 flex items-center justify-center text-3xl"
                    >
                      🌐
                    </motion.div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{t('finance.community')}</span>
                  </div>
                </div>

                {/* Circular Money Particles */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 pointer-events-none"
                >
                  <motion.div className="absolute top-1/4 left-1/2 -translate-x-1/2 text-lg">✨</motion.div>
                  <motion.div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 text-lg">💰</motion.div>
                </motion.div>

                {/* Growth indicator */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2 }}
                  className="absolute left-1/2 top-4 -translate-x-1/2 bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1"
                >
                  <TrendingUp className="w-3 h-3" />
                  {t('finance.constant_growth')}
                </motion.div>
              </div>

              {/* Benefits list */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-gray-900 flex items-center">
                  {t('finance.benefits_title')}
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    t('finance.benefit_1'),
                    t('finance.benefit_2'),
                    t('finance.benefit_3'),
                    t('finance.benefit_4')
                  ].map((item, index) => (
                    <div key={index} className="flex gap-3 items-start text-sm text-gray-600 p-3 bg-emerald-50/50 rounded-xl">
                      <span className="text-emerald-500 mt-0.5">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* AI & Automation Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="p-6 md:p-12">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {t('finance.ai_title')}
              </h2>
              <p className="text-sm md:text-md text-gray-500 mt-3 max-w-2xl mx-auto leading-relaxed">
                {t('finance.ai_subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Old Model AI */}
              <div className="p-6 rounded-2xl bg-red-50/30 border border-red-100 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                    ✕
                  </div>
                  <h3 className="font-bold text-gray-900">{t('finance.ai_old_title')}</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    t('finance.ai_old_list_1'),
                    t('finance.ai_old_list_2'),
                    t('finance.ai_old_list_3'),
                    t('finance.ai_old_list_4')
                  ].map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-600 leading-snug">
                      <span className="text-red-400">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* New Model AI */}
              <div className="p-6 rounded-2xl bg-emerald-50/30 border border-emerald-100 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                    ✓
                  </div>
                  <h3 className="font-bold text-gray-900">{t('finance.ai_new_title')}</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    t('finance.ai_new_list_1'),
                    t('finance.ai_new_list_2'),
                    t('finance.ai_new_list_3'),
                    t('finance.ai_new_list_4')
                  ].map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-600 leading-snug">
                      <span className="text-emerald-400">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 p-6 rounded-2xl bg-indigo-50 border border-indigo-100 text-center">
              <p className="text-lg font-bold text-indigo-900">
                {t('finance.ai_conclusion_1')} <span className="text-red-500 line-through">{t('finance.ai_conclusion_old_model')}</span>
              </p>
              <p className="mt-2 text-sm text-indigo-700">
                {t('finance.ai_conclusion_2')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action Section */}
        <div className="mt-16 text-center space-y-8">
          <div className="inline-flex flex-col items-center bg-gray-50 p-8 rounded-3xl border border-gray-100 w-full max-w-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-6">{t('finance.differences_title')}</h3>
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="flex flex-col items-center gap-2">
                <div className="text-3xl">👤 ➔ 💰 ➔ 🏢</div>
                <span className="text-xs text-red-500 font-bold uppercase tracking-widest">{t('finance.goodbye_money')}</span>
              </div>
              <div className="hidden md:block text-2xl text-gray-300">➔</div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-3xl text-emerald-600">👤 🔄 💰 🔄 🏢</div>
                <span className="text-xs text-emerald-600 font-bold uppercase tracking-widest">{t('finance.money_returns')}</span>
              </div>
            </div>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="max-w-xl mx-auto space-y-6"
          >
            <h4 className="text-xl md:text-2xl font-extrabold text-gray-900">
              {t('finance.cta_title')}
            </h4>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => router.back()}
              className="w-full sm:w-auto px-10 py-5 bg-emerald-600 text-white font-bold rounded-2xl shadow-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-3"
            >
              <span>{t('finance.buy_at_home')}</span>
              <Globe className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>

        {/* Manifesto/Choice Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 mb-10 max-w-3xl mx-auto text-center space-y-8 px-4"
        >
          <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-50/50 to-purple-50/50 border border-indigo-100/50 backdrop-blur-sm">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
              {t('finance.bottom_text_1')}
            </p>

            <div className="w-16 h-px bg-indigo-200 mx-auto my-6"></div>

            <p className="text-lg md:text-xl text-indigo-900 font-bold">
              {t('finance.bottom_text_2')}
            </p>

            <div className="w-16 h-px bg-indigo-200 mx-auto my-6"></div>

            <div className="space-y-4">
              <p className="text-gray-600 italic">
                "{t('finance.bottom_text_3')}"
              </p>
              <p className="text-gray-900 font-bold text-lg uppercase tracking-wide">
                {t('finance.bottom_text_4')}
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="py-12 border-t border-gray-100 text-center text-gray-400 text-xs">
        <p>{t('finance.footer_text')}</p>
      </footer>
    </div >
  );
}
