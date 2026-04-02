import React from "react";
import { Mail, TrendingDown, Phone, Lock, Users, AlertTriangle, Zap, Eye, Shield } from "lucide-react";

export const wikiCategories = [
  { id: 1, icon: <Mail size={28} />, title: "Фишинг", color: "blue", desc: "Жеке деректер мен банк реквизиттерін ұрлауға арналған жалған хаттар, SMS және сайттар.", tags: ["Email", "SMS", "Жалған сайттар"] },
  { id: 2, icon: <TrendingDown size={28} />, title: "Қаржы пирамидалары", color: "red", desc: "Нақты бизнес-моделі жоқ, жоғары табыс уәде ететін MLM және Понци схемалары.", tags: ["MLM", "Инвестиция", "Крипто"] },
  { id: 3, icon: <Phone size={28} />, title: "Жалған қоңыраулар (Вишинг)", color: "amber", desc: "Банк қызметкері, полиция немесе шенеунік ретінде хабарласатын алаяқтар.", tags: ["Колл-орталық", "Кейіптену"] },
  { id: 4, icon: <Lock size={28} />, title: "Бопсалаушы бағдарламалар (Ransomware)", color: "blue", desc: "Файлдарыңызды шифрлап, оны ашу үшін ақша талап ететін зиянды бағдарламалар.", tags: ["Вирус", "Крипто", "Деректер"] },
  { id: 5, icon: <Users size={28} />, title: "Әлеуметтік инженерия", color: "green", desc: "Құпия ақпаратты алу үшін адамдарды психологиялық манипуляциялау.", tags: ["Психология", "Сенімге қиянат"] },
  { id: 6, icon: <AlertTriangle size={28} />, title: "Жалған жұмыс ұсыныстары", color: "amber", desc: "Алдын ала төлем немесе жеке құжаттарды талап ететін жалған вакансиялар.", tags: ["Жұмыспен қамту", "HR алаяқтық"] },
  { id: 7, icon: <Zap size={28} />, title: "Крипто-алаяқтық", color: "red", desc: "Жалған биржалар мен цифрлық актив инвесторларын алдайтын схемалар.", tags: ["Крипто", "DeFi", "NFT"] },
  { id: 8, icon: <Eye size={28} />, title: "Жеке деректерді ұрлау", color: "blue", desc: "Несие алу немесе қылмыс жасау үшін сіздің жеке деректеріңізді заңсыз пайдалану.", tags: ["ЖСН", "Паспорт", "Құжаттар"] },
];

export const quizzes = [
  {
    id: 1, title: "Фишингті анықтау негіздері", difficulty: "Бастапқы", icon: <Mail size={18} />, color: "green",
    questions: [
      { q: "Электрондық хаттағы қандай белгі қауіпті білдіреді?", options: ["Жіберуші компания доменін пайдаланады", "Шұғыл әрекетті талап ететін сөздер", "Хатта нақты мекенжай көрсетілген", "Сіз бұл хатты күткенсіз"], answer: 1 },
      { q: "Банктен шотыңызды растау үшін сілтемеге өтуді сұрайтын SMS келсе, не істейсіз?", options: ["Шотты бұғаттамау үшін бірден өтемін", "Ескерту ретінде достарыма жіберемін", "Сілтемеге өтпеймін — банктің ресми нөміріне өзім хабарласамын", "'STOP' деп жауап жазамын"], answer: 2 },
      { q: "Жалған веб-сайттың сілтемесі (URL) көбіне қалай көрінеді?", options: ["https://kaspi.kz", "https://kaspii.kz-login.com", "https://secure.kaspi.kz/app", "https://kaspi.kz/login"], answer: 1 },
    ]
  },
  {
    id: 2, title: "Қаржы пирамидаларын тану", difficulty: "Орташа", icon: <TrendingDown size={18} />, color: "amber",
    questions: [
      { q: "Қаржы пирамидасы негізінен ақшаны қайдан алады?", options: ["Нақты өнім не қызмет сатудан", "Жаңа қатысушыларды тартудан және олардың салымдарынан", "Мемлекеттік гранттардан", "Биржалық кірістерден"], answer: 1 },
      { q: "Қандай уәде пирамиданың айқын белгісі болып табылады?", options: ["Жылына 5-7% кіріс", "Айына 30-50% кепілдендірілген табыс", "Нарыққа байланысты өзгеретін табыс", "Тек капиталды қорғау"], answer: 1 },
    ]
  }
];

export const blacklistData = [
  { id: 1, name: "InvestPro KZ Ltd", type: "Қаржы пирамидасы", status: "Расталған алаяқтық", region: "Алматы", reported: "2024-03", victims: "1,200+" },
  { id: 2, name: "CryptoGain Platform", type: "Крипто-алаяқтық", status: "Тергелуде", region: "Астана", reported: "2024-05", victims: "340+" },
  { id: 3, name: "EasyLoan.kz (жалған)", type: "Фишинг", status: "Расталған алаяқтық", region: "Онлайн", reported: "2023-11", victims: "800+" },
  { id: 4, name: "TeleBank Support Center", type: "Вишинг", status: "Тергелуде", region: "Қарағанды", reported: "2024-06", victims: "120+" },
  { id: 5, name: "QuickHire.kz", type: "Жалған жұмыс", status: "Бақылауда", region: "Онлайн", reported: "2024-04", victims: "67+" },
];

export const COLORS = {
  blue: "#0f3460", blueMid: "#1a4a8a", blueLight: "#e8f0fb",
  green: "#059669", greenLight: "#d1fae5",
  red: "#dc2626", redLight: "#fee2e2",
  amber: "#d97706", amberLight: "#fef3c7",
  gray: "#6b7280", grayLight: "#f9fafb", border: "#e5e7eb",
};
