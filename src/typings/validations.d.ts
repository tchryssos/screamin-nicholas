type ValidationFields = {
  validate: boolean;
  customError?: string;
};

export type ValidationObj = {
  shouldBeInServer?: ValidationFields;
  shouldBeInVoice?: ValidationFields;
  shouldHaveUrl?: ValidationFields;
  shouldHaveQueue?: ValidationFields;
};
