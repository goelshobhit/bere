module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      `UPDATE
      mail_templates
  SET
      mt_body = 'Thank you for signing up. <p>To complete the registration process, please verify your email address by clicking on the link below or using the provided OTP.</p><p>Verification Link : <a href="[VLINK]">verify now</a></p><p>OTP : [OTP]</p>'
  where
      mt_name = 'verify_email'`
    );
  },
};
