DROP TABLE IF EXISTS Product_Categories;
DROP TABLE IF EXISTS Banner;
DROP TABLE IF EXISTS Categories;
DROP TABLE IF EXISTS Product_Images;
DROP TABLE IF EXISTS Product_Reviews;
DROP TABLE IF EXISTS Order_Items;
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS Products;
DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
    user_id BIGINT AUTO_INCREMENT NOT NULL UNIQUE,
    role ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    full_name VARCHAR(30) NOT NULL,
    email VARCHAR(30) NOT NULL UNIQUE,
    password VARCHAR(60) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    avatar_id VARCHAR(40) DEFAULT 'ID',
    avatar_url VARCHAR(150) DEFAULT 'NO AVATAR',
    reset_password_token VARCHAR(64),
    reset_password_expire DATETIME,
    CONSTRAINT pk_users PRIMARY KEY(user_id)
);

CREATE TABLE Products (
    product_id BIGINT AUTO_INCREMENT NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500) NOT NULL DEFAULT '',
    stock INT NOT NULL DEFAULT 0,
    price FLOAT NOT NULL,
    ratings FLOAT DEFAULT 0,
    num_reviews INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_products PRIMARY KEY(product_id),
    CONSTRAINT fk_products_users FOREIGN KEY(user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

ALTER TABLE Products
ADD CONSTRAINT chk_stock CHECK (stock >= 0);

CREATE TABLE Categories (
    user_id BIGINT NOT NULL,
    category_id BIGINT AUTO_INCREMENT NOT NULL UNIQUE,
    category_name VARCHAR(20) NOT NULL,
    discount FLOAT NOT NULL DEFAULT 0,
    CONSTRAINT pk_categories PRIMARY KEY(category_id),
    CONSTRAINT fk_categories_users FOREIGN KEY(user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

ALTER TABLE Categories
ADD CONSTRAINT chk_discount CHECK (discount >= 0 AND discount < 1);

CREATE TABLE Product_Categories (
    category_id BIGINT,
    product_id BIGINT,
    CONSTRAINT fk_productCategories_products FOREIGN KEY(product_id) REFERENCES Products(product_id) ON DELETE CASCADE,
    CONSTRAINT fk_productCategories_categories FOREIGN KEY(category_id) REFERENCES Categories(category_id) ON DELETE CASCADE,
    CONSTRAINT pk_productCategories PRIMARY KEY(product_id, category_id)
);

CREATE TABLE Product_Images (
    image_no BIGINT AUTO_INCREMENT NOT NULL UNIQUE,
    image_id VARCHAR(40) NOT NULL,
    image_url VARCHAR(150) NOT NULL,
    product_id BIGINT,
    CONSTRAINT fk_productImages_products FOREIGN KEY(product_id) REFERENCES Products(product_id) ON DELETE CASCADE,
    CONSTRAINT pk_productImages PRIMARY KEY(image_no)
);

CREATE TABLE Product_Reviews (
    product_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    comment VARCHAR(200) NOT NULL DEFAULT '',
    rating FLOAT NOT NULL DEFAULT 0,
    CONSTRAINT fk_productReviews_products FOREIGN KEY(product_id) REFERENCES Products(product_id) ON DELETE CASCADE,
    CONSTRAINT fk_productReviews_users FOREIGN KEY(user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    CONSTRAINT pk_productReviews PRIMARY KEY(product_id, user_id)
);

ALTER TABLE Product_Reviews
ADD CONSTRAINT chk_rating CHECK (rating >= 0 AND rating <= 5);

CREATE TABLE Orders (
	order_id BIGINT AUTO_INCREMENT NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    order_status ENUM('PROCESSING', 'IN TRANSIT', 'DELIVERED', 'CANCELED') NOT NULL DEFAULT 'PROCESSING',
    placed_on DATETIME DEFAULT CURRENT_TIMESTAMP,
    postal_code VARCHAR(5) NOT NULL,
    address VARCHAR(250) NOT NULL,
    city VARCHAR(30) NOT NULL,
    province VARCHAR(30) NOT NULL,
    country VARCHAR(30) NOT NULL,
    phone_number VARCHAR(30) NOT NULL,
    payment_id VARCHAR(60),
    payment_method ENUM('CARD', 'CASH ON DELIVERY') NOT NULL,
    items_price FLOAT,
    shipping_price FLOAT,
    tax_price FLOAT,
    total_price FLOAT,
    payment_status ENUM('NOT PAID', 'PAID') NOT NULL,
    delivered_on DATETIME,
    CONSTRAINT fk_orders_users FOREIGN KEY(user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    CONSTRAINT pk_orders PRIMARY KEY(order_id)
); 

CREATE TABLE Order_Items (
	order_id BIGINT,
    product_id BIGINT,
    quantity INT,
    line_total FLOAT,
    discounted_total FLOAT,
    CONSTRAINT fk_orderItems_orders FOREIGN KEY(order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
    CONSTRAINT fk_orderItems_products FOREIGN KEY(product_id) REFERENCES Products(product_id) ON DELETE CASCADE,
    CONSTRAINT pk_orderItems PRIMARY KEY(order_id, product_id)
);

CREATE TABLE Banner (
	banner_id BIGINT AUTO_INCREMENT NOT NULL UNIQUE,
    image_id VARCHAR(40) NOT NULL,
    image_url VARCHAR(150) NOT NULL,
    banner_title VARCHAR(30) NOT NULL,
    banner_description VARCHAR(200),
    product_id BIGINT,
    category_id BIGINT,
    CONSTRAINT fk_banner_product FOREIGN KEY(product_id) REFERENCES Products(product_id),
    CONSTRAINT fk_banner_category FOREIGN KEY(category_id) REFERENCES Categories(category_id),
    CONSTRAINT pk_banner PRIMARY KEY(banner_id) 
);

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
END;

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
END;

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
END;