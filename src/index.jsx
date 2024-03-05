import React from "react";
import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import {
	captureConsoleIntegration,
	httpClientIntegration,
} from "@sentry/integrations";
import { faker } from '@faker-js/faker';

const user = {
    id: faker.string.uuid(),
    email: faker.internet.email(),
};

Sentry.init({
	dsn: "https://005cd7c891fcdbd722d0a84302352d46@o4506854488932352.ingest.us.sentry.io/4506855684440064",
	debug: true,
	release: RELEASE,
	environment: ENVIRONMENT,
	sampleRate: 1.0,
	maxBreadcrumbs: 100,
	autoSessionTracking: true,
	initialScope: {
        tags: { isInternal: true },
		user
	},
	integrations: [
        captureConsoleIntegration(),
		httpClientIntegration(),
		Sentry.browserTracingIntegration(),
	],
	tracesSampleRate: 1.0,
	tracePropagationTargets: ["localhost"],
	transport: Sentry.makeBrowserOfflineTransport(Sentry.makeFetchTransport),
    // ignoreErrors: ["Exception thrown from React"],
	// beforeSend(event, hint) {
	//     if (hint?.data?.message === 'Custom Exception thrown from React') {
	//         return null;
	//     }
	// }
});

function App() {
	function throwException() {
		throw new Error("Unhandled exception");
	}

	function captureCustomException() {
		try {
			throw new Error("Custom handled exception");
		} catch (error) {
			Sentry.captureException(error);
		}
	}

	function captureMessage() {
		Sentry.captureMessage(
			`Message captured from React at ${Date.now()}`
		);
	}

	function captureExceptionWithScope() {
		try {
			getSomething();
		} catch (error) {
			Sentry.withScope((scope) => {
				scope.setExtra("params", { id: "foo" });
				scope.setTag("source", "getsomething-sdk");
				scope.setLevel("info");
				Sentry.captureException(error);
			});
		}
	}

	function distributedTrace() {
		let user = null;
		Sentry.startSpan({ name: "get-set-user-transaction" }, () => {
			Sentry.startSpan(
				{ op: "http", name: "GET /user" },
				async (span) => {
					const response = await fetch("/user");
					user = await response.json();
					span.setAttribute(
						"http.traceId",
						response.headers.get("x-trace-id")
					);
				}
			);
			Sentry.startSpan({ name: "set user", op: "function" }, () => {
				localStorage.setItem("user", JSON.stringify(user));
			});
		});
	}

	return (
		<div>
			<h1>Hello from React!</h1>
			<button onClick={throwException}>Throw error</button>
			<button onClick={captureCustomException}>
				Capture custom Exception
			</button>
			<button onClick={captureMessage}>Capture message</button>
			<button onClick={captureExceptionWithScope}>
				Capture Exception with scope
			</button>
			<button onClick={distributedTrace}>
				Distributed Trace
            </button>

		</div>
	);
}
const starttime = Date.now();
const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
Sentry.setMeasurement("app render", Date.now()-starttime, "millisecond");
