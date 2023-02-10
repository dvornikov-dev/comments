INSERT INTO "User" ("username", "email", "homeUrl") VALUES
  ('admin', 'admin@example.com', 'http://example.com'),
  ('user', 'user@example.com', 'http://example.com'),
  ('marcus', 'marcus@example.com', 'http://example.com');

-- Examples login/password
-- admin/123456
-- marcus/marcus
-- user/nopassword

INSERT INTO "Comment" ("message", "userId", "parentId") VALUES
  ('First comment', 1, null),
  ('Second comment', 1, null),
  ('First comment reply', 1, 1),
  ('Second coment reply', 1, 2);
