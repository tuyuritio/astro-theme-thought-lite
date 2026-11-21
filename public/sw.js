// self.addEventListener("install", event => {
// 	console.log("Service Worker installed");
// });

self.addEventListener("push", event => {
	if (!event.data) return;

	const data = event.data.json();
	event.waitUntil(
		self.registration.showNotification(data.title, {
			body: data.body,
			icon: "/favicon.svg",
			silent: true,
			timestamp: data.timestamp,
			data: {
				url: data.url || "/"
			}
		})
	);
});

self.addEventListener("notificationclick", event => {
	event.notification.close();
	event.waitUntil(clients.openWindow(event.notification.data.url));
});
