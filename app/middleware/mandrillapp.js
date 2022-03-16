const axios = require("axios");

const sendAnEmailUsingTemplate = async (templateName, templateContent, recipentEmail) => {
  //   const templateContent = [
  //     {
  //         "name": "hello_title",
  //         "content": "Hello my friend, this is a test"
  //     }
  //   ]
  const requestUrl = `${process.env.MANDRILLAPP}/messages/send-template`;
  const body = {
    "key": process.env.MANDRILLAPP_KEY ,
    "template_name":templateName,
    "template_content": templateContent,
    "message": {"from_email": process.env.MANDRILLAPP_SENDER_EMAIL,
    "to": [{ "email": recipentEmail, "type": "to" }]
    }
  }
  try {
    const res = await axios.post(
      requestUrl,
      body
    );
    return res;
  } catch (error) {
    console.log(error.response)
    return error.response;
  }
};
module.exports = {
    sendAnEmailUsingTemplate: sendAnEmailUsingTemplate
  };
  
  