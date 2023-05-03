const generator = {
  referralLink: async () => {
    const { nanoid } = await import("nanoid");
    return nanoid();
  },
};

module.exports = generator;
