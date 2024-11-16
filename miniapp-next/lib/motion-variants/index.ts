export const fadeInVariant = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export const staggerVariant = {
  animate: {
    transition: {
      staggerVariantChildren: 0.1,
    },
  },
};
