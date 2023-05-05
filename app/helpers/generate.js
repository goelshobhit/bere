const generator = {
  referralLink: (referralCode) => {
    return `/signup/${referralCode}`;
  },
  // referralCode: async () => {
  //   const { nanoid } = await import("nanoid");
  //   return nanoid(10);
  // },
};

module.exports = generator;
