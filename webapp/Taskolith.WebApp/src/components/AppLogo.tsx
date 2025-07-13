import React from 'react';

type AppLogoProps = {
  className?: string;
};

export function AppLogo({ className = "mb-8" }: AppLogoProps) {
  return (
    <div className={`text-center ${className}`}>
      <h1 className="text-main-font-color text-4xl font-bold">Taskolith</h1>
    </div>
  );
}

