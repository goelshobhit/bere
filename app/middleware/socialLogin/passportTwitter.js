module.exports = passport => {
    const common = require("../../common");
    const TwitterStrategy = require('passport-twitter').Strategy;
    passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.SITE_API_URL + "users/social_login/twitter/callback/"
  },
  async function(accessToken, refreshToken, profile, done) {
    const db = require("../../models");
    const Cryptr = require('cryptr');
    const cryptr = new Cryptr('socialappAPI');
    const audit_log = db.audit_log
    const Users = db.users;
    const User_profile = db.user_profile;
    const User_social_ext = db.user_social_ext;
    const accountBalance = db.account_balance;
    const mailer = require("../mailer.js");
    const mail_templates = db.mail_templates;
    const { id, username, emails} = profile;
    const twitterDomain = "https://www.twitter.com/";
    const emailEnd = (emails && emails.length > 0) ? emails[0].value : null 
    const linkEnd = username ? twitterDomain + username : twitterDomain + id;
    const usernameEnd = username ? username : ( emailEnd ? emailEnd : null ) ;
        const UserDetails = await Users.findOne({
            include: [{
                model: db.user_profile
            },
            {
                model: db.user_social_ext
            },
            {
                model: db.user_content_post,
                attributes: ['ta_task_id'],
                where:{
                    ucpl_status:`1`
                },
                required:false
            }
            ],
            attributes:["u_id","u_referer_id","u_acct_type","u_act_sec","u_email","u_active","u_fb_username","u_fb_id","u_gmail_username","u_gmail_id","u_ymail_username","u_ymail_id","u_pref_login","u_pinterest_username","u_pinterest_id","u_instagram_username","u_instagram_id","u_twitter_username","u_twitter_id","u_tiktok_username","u_tiktok_id","u_snapchat_username","u_snapchat_id","u_created_at","u_updated_at","u_email_verify_status"],
            where: {
                u_twitter_id: id
            }
        });	
        if (UserDetails) {
            const returning = {
                message: "Already Registered",
                data: UserDetails,
                access_token: common.generateToken(UserDetails.u_id),
                media_token: common.imageToken(UserDetails.u_id)
            }
            done(null, returning);
        }
        else {
            const template = await mail_templates.findOne({
                where: {
                    mt_name: 'verify_email'
                }
            });
            const login_type = "Twitter";
            const data = {
                "u_acct_type": 0,
                "u_referer_id": 0,
                "u_act_sec": 0,
                "u_login": "",
                "u_pass": login_type,
                "u_email": "",
                "au_salt": Users.generateSalt(),
                "u_active": true,
                "u_fb_username": "",
                "u_fb_id": "",
                "u_gmail_username": "",
                "u_gmail_id": "",
                "u_ymail_username": "",
                "u_ymail_id": "",
                "u_pref_login": 0,
                "u_instagram_username": "",
                "u_instagram_id": "",
                "u_twitter_username": usernameEnd ? usernameEnd.toString() : "",
                "u_twitter_id": id,
                "u_pinterest_username": "",
                "u_pinterest_id": "",
                "u_tiktok_username": "",
                "u_tiktok_id": "",
                "u_snapchat_username": "",
                "u_snapchat_id": "",
            }
            Users.create(data)
                .then(data => {
                    accountBalance.create({ac_user_id:data.u_id,ac_balance:0,ac_account_no:''});
                    User_profile.create({u_id:data.u_id});
                    User_social_ext.create({
                        use_u_twitter_link: linkEnd,
                        show_twitter: false,
                        u_id:data.u_id
                    });
                    audit_log.saveAuditLog(data.u_id,'add','user_login',data.u_id,data.dataValues);
            if(emailEnd) {
                try {
                const encryptedID = cryptr.encrypt(data.u_id);
                const vlink=process.env.SITE_API_URL+'users/verify_email/'+encryptedID;
                var templateBody=template.mt_body;
                templateBody=templateBody.replace("[CNAME]", emailEnd);
                templateBody=templateBody.replace("[VLINK]", vlink);
                const message = {
                    from: "Socialbrands1@gmail.com",
                    to: emailEnd,
                    subject: template.mt_subject,
                    html: templateBody
                };
                mailer.sendMail(message);
                } catch(err) {
                    console.log(err)
                }
            }
            const returning = {
                message: "User Added Successfully",
                data,
                access_token:common.generateToken(data.u_id),
                media_token:common.imageToken(data.u_id)
            }
                done(null, returning)
            })
            .catch(err => {
                console.log(err)
                done(null, null)
            });
        }
    }
));
}