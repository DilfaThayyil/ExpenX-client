export type Translations = {
    [key: string]: {
      features: string;
      whyExpenX: string;
      about: string;
      startAdvisor: string;
    };
  };
  
  export type NavbarProps = {
    darkMode: boolean;
    onToggleDarkMode: () => void;
    onToggleLanguage: () => void;
    logoText: string;
  };
  