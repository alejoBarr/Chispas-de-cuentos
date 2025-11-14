import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  children: React.ReactNode;
}

export const Icon: React.FC<IconProps> = ({ children, ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      {children}
    </svg>
  );
};

export const BookOpenIcon = () => (
  <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></Icon>
);

export const ChatBubbleLeftRightIcon = () => (
  <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.722.06c-.28.004-.555.038-.82.096a15.24 15.24 0 01-1.296.223c-.26.024-.51.058-.748.098a15.38 15.38 0 01-2.023.23c-.33.027-.65.06-.963.098a15.32 15.32 0 01-2.023.23c-.26.024-.51.058-.748.098a15.24 15.24 0 01-1.296.223c-.263.058-.54.092-.82.096l-3.722-.06C3.347 16.902 2.5 15.938 2.5 14.802V10.516c0-.97.616-1.813 1.5-2.097l.101-.034.102-.033.102-.033.101-.034.102-.033.102-.033.1-.034.102-.033.1-.034a1.04 1.04 0 01.215-.056 16.86 16.86 0 005.18-.33c.32-.025.63-.056.92-.09a15.86 15.86 0 011.96-.23c.33-.027.65-.06.963-.098a15.86 15.86 0 011.96-.23c.29-.033.59-.064.92-.09a16.86 16.86 0 005.18-.33 1.04 1.04 0 01.215-.056l.1-.034.102-.033.1-.034.102-.033.101-.034.102-.033.102-.033.101-.034zM8 11.25a1.125 1.125 0 11-2.25 0 1.125 1.125 0 012.25 0zm4.5 0a1.125 1.125 0 11-2.25 0 1.125 1.125 0 012.25 0zm4.5 0a1.125 1.125 0 11-2.25 0 1.125 1.125 0 012.25 0z" /></Icon>
);

export const InformationCircleIcon = () => (
  <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></Icon>
);

export const SparklesIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <Icon className="w-8 h-8" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" /></Icon>
);

export const ShareIcon = () => (
  <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.195.025.39.05.588.08a2.25 2.25 0 0 1 4.249 0c.198-.03.393-.055.588-.08a2.25 2.25 0 1 0 0-2.186m0 2.186v-2.186" /></Icon>
);

export const PlusCircleIcon = () => (
  <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></Icon>
);

export const SaveIcon = () => (
    <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></Icon>
);

export const TrashIcon = () => (
  <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></Icon>
);

export const SpeakerWaveIcon = () => (
  <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" /></Icon>
);

export const SpeakerXMarkIcon = () => (
    <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0L17.25 14.25M19.5 12l2.25-2.25M19.5 12l2.25 2.25M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" /></Icon>
);