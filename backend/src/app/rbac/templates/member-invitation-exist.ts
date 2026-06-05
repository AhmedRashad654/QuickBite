export function memberInvitationExist(name: string, role: string): { subject: string; html: string } {
  const subject = `📢 You've been added to a new restaurant team on QuickBite!`;
  const formattedRole = role.toUpperCase();

  const html = `
    <!DOCTYPE html>
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Team Update</title>
      <style type="text/css">
        body {
          margin: 0;
          padding: 0;
          width: 100% !important;
          background-color: #f4f6f8;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
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
                  <h2 style="margin-top: 0; font-size: 20px; color: #1a1a1a; font-weight: 700;">Welcome to Your New Team!</h2>
                  <p style="font-size: 16px; line-height: 1.6; color: #555555;">
                    Hi <strong>${name}</strong>,
                  </p>
                  <p style="font-size: 16px; line-height: 1.6; color: #555555;">
                    Great news! You have been successfully added to a new restaurant team on QuickBite App.
                  </p>
                  
                  <div style="margin: 20px 0; text-align: center;">
                    <span style="background-color: #f0fdf4; color: #16a34a; font-size: 14px; font-weight: bold; padding: 8px 16px; border-radius: 20px; border: 1px solid #bbf7d0; display: inline-block;">
                      💼 ASSIGNED ROLE: ${formattedRole}
                    </span>
                  </div>

                  <p style="font-size: 16px; line-height: 1.6; color: #555555; text-align: center; margin-top: 25px;">
                    Since you already have an active QuickBite account, there's no need to reset your password. You can log in and access your new workspace right away using your current credentials.
                  </p>
                </td>
              </tr>

              <tr>
                <td bgcolor="#f8f9fa" style="padding: 20px 30px; text-align: center; border-top: 1px solid #eaeaea;">
                  <p style="margin: 0; font-size: 12px; color: #999999; line-height: 1.5;">
                    &copy; 2026 QuickBite Team Management. All rights reserved.<br />
                    If this wasn't you, please secure your account or contact support.
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