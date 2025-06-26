self.addEventListener('notificationclick', function (event) {
	event.notification.close();

	event.waitUntil(
		clients.matchAll({ type: "window" }).then(function (clientList) {
			for (const element of clientList) {
				let client = element;
				if (client.url === '/' && 'focus' in client) {
					return client.focus();
				}
			}
			
			if (clients.openWindow) {
				return clients.openWindow('/todos'); // Opens the app if it's closed
			}
		})
	);
});
