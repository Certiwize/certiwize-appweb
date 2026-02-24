import { onRequestPost as __api_analyze_doc_js_onRequestPost } from "/home/salah/Desktop/Certiwize/certiwize-app/functions/api/analyze-doc.js"
import { onRequestPost as __api_chat_js_onRequestPost } from "/home/salah/Desktop/Certiwize/certiwize-app/functions/api/chat.js"
import { onRequestOptions as __api_complete_gocardless_checkout_js_onRequestOptions } from "/home/salah/Desktop/Certiwize/certiwize-app/functions/api/complete-gocardless-checkout.js"
import { onRequestPost as __api_complete_gocardless_checkout_js_onRequestPost } from "/home/salah/Desktop/Certiwize/certiwize-app/functions/api/complete-gocardless-checkout.js"
import { onRequestOptions as __api_create_gocardless_subscription_js_onRequestOptions } from "/home/salah/Desktop/Certiwize/certiwize-app/functions/api/create-gocardless-subscription.js"
import { onRequestPost as __api_create_gocardless_subscription_js_onRequestPost } from "/home/salah/Desktop/Certiwize/certiwize-app/functions/api/create-gocardless-subscription.js"
import { onRequestOptions as __api_create_lead_js_onRequestOptions } from "/home/salah/Desktop/Certiwize/certiwize-app/functions/api/create-lead.js"
import { onRequestPost as __api_create_lead_js_onRequestPost } from "/home/salah/Desktop/Certiwize/certiwize-app/functions/api/create-lead.js"
import { onRequestPost as __api_generate_convention_js_onRequestPost } from "/home/salah/Desktop/Certiwize/certiwize-app/functions/api/generate-convention.js"
import { onRequestPost as __api_generate_project_doc_js_onRequestPost } from "/home/salah/Desktop/Certiwize/certiwize-app/functions/api/generate-project-doc.js"
import { onRequestPost as __api_generate_training_pdf_js_onRequestPost } from "/home/salah/Desktop/Certiwize/certiwize-app/functions/api/generate-training-pdf.js"
import { onRequestPost as __api_trigger_workflow_js_onRequestPost } from "/home/salah/Desktop/Certiwize/certiwize-app/functions/api/trigger-workflow.js"

export const routes = [
    {
      routePath: "/api/analyze-doc",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_analyze_doc_js_onRequestPost],
    },
  {
      routePath: "/api/chat",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_chat_js_onRequestPost],
    },
  {
      routePath: "/api/complete-gocardless-checkout",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_complete_gocardless_checkout_js_onRequestOptions],
    },
  {
      routePath: "/api/complete-gocardless-checkout",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_complete_gocardless_checkout_js_onRequestPost],
    },
  {
      routePath: "/api/create-gocardless-subscription",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_create_gocardless_subscription_js_onRequestOptions],
    },
  {
      routePath: "/api/create-gocardless-subscription",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_create_gocardless_subscription_js_onRequestPost],
    },
  {
      routePath: "/api/create-lead",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_create_lead_js_onRequestOptions],
    },
  {
      routePath: "/api/create-lead",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_create_lead_js_onRequestPost],
    },
  {
      routePath: "/api/generate-convention",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_generate_convention_js_onRequestPost],
    },
  {
      routePath: "/api/generate-project-doc",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_generate_project_doc_js_onRequestPost],
    },
  {
      routePath: "/api/generate-training-pdf",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_generate_training_pdf_js_onRequestPost],
    },
  {
      routePath: "/api/trigger-workflow",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_trigger_workflow_js_onRequestPost],
    },
  ]