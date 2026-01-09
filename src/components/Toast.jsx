import React from 'react';
import { useToastContext } from '../context';

export default function Toast() {
	const { toasts } = useToastContext();

	if (!toasts || toasts.length === 0) return null;

	return (
		<div className="toast-container">
			{toasts.map((t) => (
				<div key={t.id} className={`toast toast--${t.type || 'info'}`}>
					{t.message}
				</div>
			))}
		</div>
	);
}
