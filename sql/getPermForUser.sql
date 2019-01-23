SELECT p.id, p.name
	FROM permissions p, userPerm l
	WHERE p.id==l.perm
		AND l.user==?;
