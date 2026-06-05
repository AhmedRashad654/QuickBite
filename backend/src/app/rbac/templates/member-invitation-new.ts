
export function memberInvitationNew(otp: string, role: string): { subject: string; html: string } {
  const subject = `📩 You are invited to join QuickBite as a ${role}`;

  const formattedRole = role.toUpperCase();

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Join the Team</title>
      <style type="text/css">
        body {
          margin: 0;
          padding: 0;
          width: 100% !important;
          background-color: #f4f6f8;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        }
        img {
          border: 0;
          height: auto;
          line-height: 100%;
          outline: none;
          text-decoration: none;
        }
        table {
          border-collapse: collapse !important;
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f6f8;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; border: 1px solid #e1e4e8; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
              
              <tr>
                <td align="center" bgcolor="#FF5A5F" style="padding: 30px 20px;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: bold; letter-spacing: 1px;">QuickBite 🍔</h1>
                </td>
              </tr>

              <tr>
                <td style="padding: 40px 30px; color: #333333;">
                  <h2 style="margin-top: 0; font-size: 20px; color: #1a1a1a; font-weight: 700;">Workspace Invitation</h2>
                  <p style="font-size: 16px; line-height: 1.6; color: #555555;">
                    Your team has invited you to join their workspace on QuickBite App. You have been assigned the following role:
                  </p>
                  
                  <div style="margin: 20px 0; text-align: center;">
                    <span style="background-color: #fff3f3; color: #FF5A5F; font-size: 14px; font-weight: bold; padding: 8px 16px; border-radius: 20px; border: 1px solid #ffdbdb; display: inline-block;">
                      💼 ROLE: ${formattedRole}
                    </span>
                  </div>

                  <p style="font-size: 16px; line-height: 1.6; color: #555555; text-align: center;">
                    Please use the invitation code below to accept the invite and set up your account:
                  </p>

                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="center" style="padding: 10px 0 20px 0;">
                        <table border="0" cellpadding="0" cellspacing="0">
                          <tr>
                            <td align="center" bgcolor="#f8f9fa" style="border: 2px dashed #FF5A5F; border-radius: 6px; padding: 15px 30px;">
                              <span style="font-size: 30px; font-weight: bold; letter-spacing: 5px; color: #1a1a1a;">${otp}</span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <p style="font-size: 14px; line-height: 1.5; color: #777777; border-top: 1px solid #eaeaea; padding-top: 20px; margin-top: 25px;">
                    💡 <strong>Note:</strong> This invitation code is sensitive and belongs to your designated email. Do not share it with anyone else.
                  </p>
                </td>
              </tr>

              <tr>
                <td bgcolor="#f8f9fa" style="padding: 20px 30px; text-align: center; border-top: 1px solid #eaeaea;">
                  <p style="margin: 0; font-size: 12px; color: #999999; line-height: 1.5;">
                    &copy; 2026 QuickBite Team Management. All rights reserved.<br />
                    If you didn't expect this invitation, you can ignore this email.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return { subject, html };
}