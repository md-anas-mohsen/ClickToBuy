DELIMITER //
CREATE OR REPLACE TRIGGER trg_update_reviews
AFTER INSERT ON product_reviews FOR EACH ROW
BEGIN
	DECLARE  v_review_count integer;
    DECLARE v_avg_ratings float;
    
    SELECT count(product_id), avg(rating) INTO v_review_count, v_avg_ratings
    FROM product_reviews
    GROUP BY product_id
    HAVING product_id = NEW.product_id;
    
    UPDATE products
    SET num_reviews = v_review_count,
    	ratings = v_avg_ratings
    WHERE product_id = NEW.product_id;
END//
DELIMITER ;

DELIMITER //
CREATE OR REPLACE TRIGGER trg_update_reviewUpdate
AFTER UPDATE ON product_reviews FOR EACH ROW
BEGIN
	DECLARE  v_review_count integer;
    DECLARE v_avg_ratings float;
    
    SELECT count(product_id), avg(rating) INTO v_review_count, v_avg_ratings
    FROM product_reviews
    GROUP BY product_id
    HAVING product_id = NEW.product_id;
    
    UPDATE products
    SET num_reviews = v_review_count,
    	ratings = v_avg_ratings
    WHERE product_id = NEW.product_id;
END//
DELIMITER ;

DELIMITER //
CREATE OR REPLACE TRIGGER trg_update_reviewDelete
AFTER DELETE ON product_reviews FOR EACH ROW
BEGIN
	DECLARE  v_review_count integer;
    DECLARE v_avg_ratings float;
    
    SELECT count(product_id), avg(rating) INTO v_review_count, v_avg_ratings
    FROM product_reviews
    GROUP BY product_id
    HAVING product_id = OLD.product_id;
    
    UPDATE products
    SET num_reviews = IFNULL(v_review_count, 0),
    	ratings = IFNULL(v_avg_ratings, 0)
    WHERE product_id = OLD.product_id;
END//
DELIMITER ;