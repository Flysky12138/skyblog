-- @param {String} $1:directory id

WITH RECURSIVE
  tree AS (
    SELECT
      id,
      0 AS depth
    FROM
      directories
    WHERE
      id = $1
    UNION ALL
    SELECT
      d.id,
      tree.depth + 1
    FROM
      directories d
      INNER JOIN tree ON d.parent_id = tree.id
  )
SELECT
  id,
  depth
FROM
  tree
ORDER BY
  depth DESC
