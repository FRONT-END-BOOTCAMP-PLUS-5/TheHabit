'use client';

//차후 tailwind css 사용할때 상수화

interface IButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  buttonType?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'link';
}

const BUTTON_COLORS: Record<string, string> = {
  primary:
    'bg-primary font-bold text-white hover:bg-white hover:text-primary border-2 border-primary',
  secondary:
    'bg-secondary font-bold text-white hover:bg-white hover:text-secondary border-2 border-secondary',
  tertiary:
    'bg-primary-grey font-bold text-white hover:bg-white hover:text-primary-grey border-2 border-primary-grey',
  danger:
    'bg-red-600 text-white font-bold hover:bg-red-700 hover:text-white border-2 border-red-600 hover:border-red-700',
  link: 'bg-primary hover:bg-white hover:text-primary border-2 border-transparent hover:border-primary',
};

export const Button = ({ children, className, buttonType, ...props }: IButton) => {
  return (
    <button
      className={`${className} cursor-pointer px-4 py-1 rounded-lg ${BUTTON_COLORS[buttonType || 'primary']} ${
        props.disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      {...props}
    >
      {children}
    </button>
  );
};
