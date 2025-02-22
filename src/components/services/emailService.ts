import { supabase } from "../lib/supabase";

export interface BoardInvitation {
  email: string;
  boardName: string;
  inviterName: string;
  boardId: string;
  invitationToken: string;
}

export const sendBoardInvitation = async ({
  email,
  boardName,
  inviterName,
  boardId,
  invitationToken,
}: BoardInvitation) => {
  const invitationLink = `https://taskbees.netlify.app/board/${boardId}?token=${invitationToken}`;

  try {
    const { error } = await supabase.functions.invoke("send-email", {
      body: {
        to: email,
        subject: `🐝 Buzz! ${inviterName} has invited you to join "${boardName}"`,
        text: `Buzz! ${inviterName} has invited you to join the board "${boardName}"!\n\nClick the following link to join the hive:\n${invitationLink}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #fff8e7; padding: 20px; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <span style="font-size: 48px;">🐝</span>
            </div>
            <h2 style="color: #ffa000; text-align: center;">Sweet! You've Been Invited!</h2>
            <p style="color: #333; font-size: 16px; line-height: 1.5;">
              Hey there! <strong>${inviterName}</strong> thinks you'd be a great addition to the busy bees working on <strong>"${boardName}"</strong>!
            </p>
            <p style="color: #333; font-size: 16px; line-height: 1.5;">
              Join our hive and let's create something amazing together! 🍯
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${invitationLink}" 
                 style="background-color: #ffa000; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 20px; display: inline-block;
                        font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                Join the Hive! 🐝
              </a>
            </div>
            <p style="color: #666; font-size: 0.9em; text-align: center;">
              If the button doesn't work, copy and paste this URL into your browser:<br>
              <span style="color: #ffa000;">${invitationLink}</span>
            </p>
            <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
              Sent with 🍯 from Task Bees
            </div>
          </div>
        `,
      },
    });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("An unknown error occurred:", error);
    }
  }
};
