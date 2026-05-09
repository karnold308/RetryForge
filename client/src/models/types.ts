export interface SolutionFeature {
  title: string;
  icon: string;
};

export interface LostMMR {
  mrr: number,
  failedRevenue: number;
  recoverable: number;
  weRecover: number;
  weCharge: number;
  netGain: number;
};

export interface FAQ {
  question: string;
  answer: string;
}

export interface SignUpFormState {
  success: boolean | null;
  message: string;
}