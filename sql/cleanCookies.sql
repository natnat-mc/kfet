DELETE FROM cookies
	WHERE expires<strftime('%s', 'now');
