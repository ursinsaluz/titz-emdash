import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import { d1, r2 } from "@emdash-cms/cloudflare";
import { formsPlugin } from "@emdash-cms/plugin-forms";
import { webhookNotifierPlugin } from "@emdash-cms/plugin-webhook-notifier";
import { defineConfig, fontProviders } from "astro/config";
import emdash from "emdash/astro";
import tailwindcss from "@tailwindcss/vite";

/**
 * Cloudflare Email Provider for EmDash
 * Uses the SEND_EMAIL binding to deliver system emails (magic links, invites).
 */
const cloudflareEmailPlugin = () => ({
	id: "cloudflare-email",
	name: "Cloudflare Email",
	version: "1.0.0",
	capabilities: ["email:provide" as any],
	hooks: {
		"email:deliver": async (event: any, ctx: any) => {
			const { message } = event;
			const env = ctx.requestMeta?.env || globalThis;
			const sendEmail = env.SEND_EMAIL;

			if (!sendEmail) {
				console.warn("[cloudflare-email] SEND_EMAIL binding not available. Logging to console instead.");
				console.log("Email to deliver:", message);
				return;
			}

			await sendEmail.send({
				from: "info@titz.cooking",
				to: message.to,
				subject: message.subject,
				content: [
					{ type: "text/plain", value: message.text },
					{ type: "text/html", value: message.html || message.text },
				],
			});
		},
	},
});

export default defineConfig({
	output: "server",
	adapter: cloudflare({
		imageService: 'passthrough'
	}),
	image: {
		layout: "constrained",
		responsiveStyles: true,
	},
	integrations: [
		react(),
		emdash({
			siteUrl: "https://titz.cooking",
			database: d1({ binding: "DB", session: "auto" }),
			storage: r2({ binding: "MEDIA" }),
			plugins: [cloudflareEmailPlugin(), formsPlugin(), webhookNotifierPlugin()]
		}),
	],
	vite: {
		plugins: [tailwindcss()]
	},
	fonts: [
		{
			provider: fontProviders.google(),
			name: "Inter",
			cssVariable: "--font-sans",
			weights: [400, 500, 600, 700],
			fallbacks: ["sans-serif"],
		},
		{
			provider: fontProviders.google(),
			name: "JetBrains Mono",
			cssVariable: "--font-mono",
			weights: [400, 500],
			fallbacks: ["monospace"],
		},
	],
	devToolbar: { enabled: false },
});
