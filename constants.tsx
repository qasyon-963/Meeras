
import { TranslationDict } from './types';

export const TRANSLATIONS: TranslationDict = {
  appName: {
    ar: "حاسبة المواريث الإسلامية",
    en: "Islamic Inheritance Calculator"
  },
  home: {
    ar: "الرئيسية",
    en: "Home"
  },
  start: {
    ar: "ابدأ الحساب",
    en: "Start Calculation"
  },
  disclaimerTitle: {
    ar: "تنبيه قانوني",
    en: "Legal Disclaimer"
  },
  disclaimerText: {
    ar: "هذا التطبيق للأغراض التعليمية والإرشادية فقط. النتائج ليست ملزمة قانونياً ولا تغني عن استشارة أهل العلم المختصين أو المحاكم الشرعية.",
    en: "This application is for educational and guidance purposes only. Results are not legally binding and do not replace professional scholarly advice or Sharia courts."
  },
  step1Title: {
    ar: "اختر اللغة",
    en: "Choose Language"
  },
  step2Title: {
    ar: "بيانات التركة",
    en: "Estate Information"
  },
  step3Title: {
    ar: "الورثة المباشرون",
    en: "Primary Heirs"
  },
  step4Title: {
    ar: "بقية الورثة",
    en: "Other Heirs"
  },
  next: {
    ar: "التالي",
    en: "Next"
  },
  back: {
    ar: "السابق",
    en: "Back"
  },
  calculate: {
    ar: "احسب التوزيع",
    en: "Calculate Distribution"
  },
  results: {
    ar: "نتائج الحساب",
    en: "Calculation Results"
  },
  estateLabel: {
    ar: "إجمالي قيمة التركة",
    en: "Total Estate Value"
  },
  debtsLabel: {
    ar: "إجمالي الديون",
    en: "Total Debts"
  },
  willLabel: {
    ar: "قيمة الوصية",
    en: "Will Amount"
  },
  debtNote: {
    ar: "تُخصم الديون من التركة قبل توزيع الميراث.",
    en: "Debts are deducted from the estate before distribution."
  },
  willNote: {
    ar: "يجب ألا تتجاوز الوصية ثلث إجمالي التركة.",
    en: "The will must not exceed one-third of the total estate."
  },
  netEstateLabel: {
    ar: "صافي التركة للتوزيع",
    en: "Net Estate for Distribution"
  },
  zeroNetEstateMsg: {
    ar: "صافي التركة صفر. لا يوجد ميراث متبقي للتوزيع بعد سداد الديون والوصايا.",
    en: "Net estate is zero. There is no remaining inheritance to distribute after paying debts and wills."
  },
  genderLabel: {
    ar: "جنس المتوفى",
    en: "Gender of Deceased"
  },
  male: {
    ar: "ذكر",
    en: "Male"
  },
  female: {
    ar: "أنثى",
    en: "Female"
  },
  wivesLabel: {
    ar: "عدد الزوجات",
    en: "Number of Wives"
  },
  husbandLabel: {
    ar: "هل يوجد زوج؟",
    en: "Is there a husband?"
  },
  sonsLabel: {
    ar: "عدد الأبناء (ذكور)",
    en: "Number of Sons"
  },
  daughtersLabel: {
    ar: "عدد البنات (إناث)",
    en: "Number of Daughters"
  },
  fatherLabel: {
    ar: "الأب",
    en: "Father"
  },
  motherLabel: {
    ar: "الأم",
    en: "Mother"
  },
  brothersLabel: {
    ar: "عدد الإخوة الأشقاء",
    en: "Number of Full Brothers"
  },
  sistersLabel: {
    ar: "عدد الأخوات الشقيقات",
    en: "Number of Full Sisters"
  },
  downloadPDF: {
    ar: "تحميل التقرير (PDF)",
    en: "Download PDF Report"
  },
  reset: {
    ar: "حساب جديد",
    en: "New Calculation"
  },
  about: {
    ar: "حول البرنامج",
    en: "About"
  },
  langChoiceAr: {
    ar: "العربية",
    en: "Arabic"
  },
  langChoiceEn: {
    ar: "الإنجليزية",
    en: "English"
  },
  willError: {
    ar: "تنبيه: قيمة الوصية تتجاوز ثلث التركة.",
    en: "Alert: Will amount exceeds one-third of the estate."
  },
  mathLogicTitle: {
    ar: "تفاصيل الحساب",
    en: "Calculation Logic"
  },
  totalSharesLabel: {
    ar: "مجموع السهام",
    en: "Total Share Units"
  },
  shareUnitValueLabel: {
    ar: "قيمة السهم الواحد",
    en: "Value per Share Unit"
  },
  sonShareUnits: {
    ar: "2 سهم لكل ابن",
    en: "2 units per son"
  },
  daughterShareUnits: {
    ar: "1 سهم لكل بنت",
    en: "1 unit per daughter"
  },
  validationText: {
    ar: "تم التأكد من مطابقة مجموع الأنصبة لصافي التركة.",
    en: "The total of all shares matches the net estate exactly."
  },
  distributionExplanation: {
    ar: "يعتمد هذا التوزيع على قواعد الميراث الإسلامية حيث يحصل الذكر على نصيب أنثيين في حالة الميراث بالتعصيب.",
    en: "This distribution is based on Islamic inheritance rules where a male receives the share of two females in case of residuary inheritance."
  },
  summaryTitle: {
    ar: "ملخص الحالة",
    en: "Case Summary"
  },
  pdfTitle: {
    ar: "بيان توزيع المواريث (لأغراض إرشادية فقط)",
    en: "Inheritance Distribution Statement (For Information Only)"
  },
  pdfDisclaimer: {
    ar: "تم إنشاء هذا المستند لأغراض إرشادية وتعليمية فقط وليس له أي حجية قانونية أو قضائية ملزمة.",
    en: "This document is generated for informational purposes only and is not legally binding."
  },
  pdfDate: {
    ar: "تاريخ الإصدار",
    en: "Date of Issue"
  },
  pdfTotalDistributed: {
    ar: "إجمالي المبلغ الموزع",
    en: "Total Distributed Amount"
  },
  individualHeirLabels: {
    ar: {
      son: "ابن",
      daughter: "ابنة",
      wife: "زوجة",
      husband: "زوج",
      father: "أب",
      mother: "أم",
      brother: "أخ شقيق",
      sister: "أخت شقيقة"
    },
    en: {
      son: "Son",
      daughter: "Daughter",
      wife: "Wife",
      husband: "Husband",
      father: "Father",
      mother: "Mother",
      brother: "Full Brother",
      sister: "Full Sister"
    }
  }
};