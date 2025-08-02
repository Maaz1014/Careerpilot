'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const useGsap = (ref: React.RefObject<HTMLElement>, animation: (ref: HTMLElement) => void) => {
  useEffect(() => {
    if (ref.current) {
      const context = gsap.context(() => {
        animation(ref.current as HTMLElement);
      }, ref);
      return () => context.revert();
    }
  }, [ref, animation]);
};

export default useGsap;
