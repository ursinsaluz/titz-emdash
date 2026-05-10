import { definePlugin } from "emdash";

/**
 * Cloudflare Email Provider Plugin
 * 
 * Implements the email:deliver hook using the SEND_EMAIL binding.
 */
export const createPlugin = () => {
	return definePlugin({
		id: "cloudflare-email",
		version: "1.0.0",
		capabilities: ["email:provide"],
		hooks: {
			"email:deliver": async (event, ctx) => {
				const { message } = event;
				// Access the environment from requestMeta
				const env = (ctx as any).requestMeta?.env || globalThis;
				const sendEmail = env.SEND_EMAIL;

				if (!sendEmail) {
					console.warn("[cloudflare-email] SEND_EMAIL binding not found in environment.");
					console.log("Email content:", message);
					return;
				}

				try {
					await sendEmail.send({
						from: "info@titz.cooking",
						to: message.to,
						subject: message.subject,
						content: [
							{ type: "text/plain", value: message.text },
							{ type: "text/html", value: message.html || message.text },
						],
					});
				} catch (error) {
					console.error("[cloudflare-email] Failed to send email:", error);
					throw error;
				}
			},
		},
	});
};

export default createPlugin;
