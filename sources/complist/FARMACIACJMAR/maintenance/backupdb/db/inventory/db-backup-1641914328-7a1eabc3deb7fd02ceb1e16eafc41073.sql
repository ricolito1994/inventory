SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
--
-- Database: `inventory`
--




 CREATE TABLE `inventory`.`alter_document` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `ACCOUNT_CODE` varchar(255) NOT NULL,
  `DOC_ID` varchar(255) NOT NULL,
  `SUPPLIER_ID` varchar(255) NOT NULL,
  `REFFERENCE_DOC_ID` varchar(255) NOT NULL,
  `TOTAL_COST` varchar(255) NOT NULL,
  `TOTAL_PRICE` varchar(255) NOT NULL,
  `UNIT_CONVERSION_ID` varchar(255) NOT NULL,
  `DATE_ENCODED` date NOT NULL,
  `DOCUMENT_DATE` date NOT NULL,
  `TYPE` varchar(255) NOT NULL,
  `STOCK_IN_OUT` tinyint(1) NOT NULL,
  `STATUS` varchar(255) NOT NULL,
  `DESCRIPTION` varchar(255) NOT NULL,
  `COMPANY_CODE` varchar(255) NOT NULL,
  `WAREHOUSE_CODE` varchar(255) NOT NULL,
  `LOT_NUMBER` varchar(255) NOT NULL,
  `EXPIRY_DATE` date NOT NULL,
  `USER` varchar(255) NOT NULL,
  `IS_REPLACED` tinyint(1) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `DOC_ID` (`DOC_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=99 DEFAULT CHARSET=latin1;


INSERT INTO inventory.alter_document VALUES
("77","","Delivery1640053048","SUPPLIER1611190040","","3200","3475","","2021-12-21","2021-12-21","Delivery","1","Open","A transaction","FCM4132021","W01","","0000-00-00","","0"),
("78","","Delivery1640053128","SUPPLIER1611190040","","3200","3475","","2021-12-21","2021-12-21","Delivery","1","Open","A transaction","FCM4132021","W01","","0000-00-00","","0"),
("79","","OR1640053179","OR1640053179","","5","200","","2021-12-21","2021-12-21","Sales Invoice","0","Cancelled","Sales Transaction","FCM4132021","","","0000-00-00","2","0"),
("81","","OR1640079318","OR1640079318","","5","300","","2021-12-21","2021-12-21","Sales Invoice","0","Cancelled","Sales Transaction","FCM4132021","","","0000-00-00","2","0"),
("82","","OR1640079613","OR1640079613","","5","370","","2021-12-21","2021-12-21","Sales Invoice","0","Close","Sales Transaction","FCM4132021","","","0000-00-00","2","0"),
("83","","Return by Customer1640359633","SUPPLIER1611190040","","1000","1000","","2021-12-24","2021-12-24","Return by Customer","1","Cancelled","A transaction","FCM4132021","W01","","0000-00-00","","0"),
("84","","Return by Customer1640362022","SUPPLIER1611190040","","10","10","","2021-12-25","2021-12-25","Return by Customer","1","Cancelled","A transaction","FCM4132021","W01","","0000-00-00","","0"),
("85","","Return by Customer1640362102","SUPPLIER1611190040","","1200","1200","","2021-12-25","2021-12-25","Return by Customer","1","Open","A transaction","FCM4132021","W01","","0000-00-00","","0"),
("86","","Return by Customer1640362157","SUPPLIER1611190040","","324","324","","2021-12-25","2021-12-25","Return by Customer","1","Open","A transaction","FCM4132021","W01","","0000-00-00","","0"),
("87","","Return by Customer1640362241","SUPPLIER1611190040","","270","270","","2021-12-25","2021-12-25","Return by Customer","1","Open","A transaction","FCM4132021","W01","","0000-00-00","","0"),
("88","","Return to Supplier1640368339","SUPPLIER1611190040","","240","240","","2021-12-25","2021-12-25","Return to Supplier","0","Open","A transaction","FCM4132021","W01","","0000-00-00","","0"),
("89","","Delivery1641206103","SUPPLIER1611190040","","100","100","","2022-01-03","2022-01-03","Delivery","1","Open","A transaction","FCM4132021","W01","","0000-00-00","","0"),
("90","","OR1641654483","OR1641654483","","7.5","997.5","","2022-01-08","2022-01-08","Sales Invoice","0","Close","Sales Transaction","FCM4132021","","","0000-00-00","2","0"),
("91","","OR1641654545","OR1641654545","","7.5","555","","2022-01-08","2022-01-08","Sales Invoice","0","Close","Sales Transaction","FCM4132021","","","0000-00-00","2","0"),
("92","","OR1641654602","OR1641654602","","5","250","","2022-01-08","2022-01-08","Sales Invoice","0","Close","Sales Transaction","FCM4132021","","","0000-00-00","2","0"),
("93","","Delivery1641718231","SUPPLIER1611190040","","1000000","1000000","","2022-01-09","2022-01-09","Delivery","1","Open","A transaction","FCM4132021","W01","","0000-00-00","","0"),
("94","","OR1641718259","OR1641718259","","500","3750","","2022-01-09","2022-01-09","Sales Invoice","0","Close","Sales Transaction","FCM4132021","","","0000-00-00","2","0"),
("95","","OR1641719392","OR1641719392","","500","75000","","2022-01-09","2022-01-09","Sales Invoice","0","Close","Sales Transaction","FCM4132021","","","0000-00-00","2","0"),
("96","","OR1641743754","OR1641743754","","7.5","285","","2022-01-09","2022-01-09","Sales Invoice","0","Close","Sales Transaction","FCM4132021","","","0000-00-00","2","0"),
("97","","OR1641743786","OR1641743786","","5","127.5","","2022-01-09","2022-01-09","Sales Invoice","0","Close","Sales Transaction","FCM4132021","","","0000-00-00","2","0"),
("98","","OR1641743803","OR1641743803","","5","120","","2022-01-09","2022-01-09","Sales Invoice","0","Close","Sales Transaction","FCM4132021","","","0000-00-00","2","0");




 CREATE TABLE `inventory`.`company_setup` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `COMPANY_NAME` varchar(255) NOT NULL,
  `COMPANY_CODE` varchar(255) NOT NULL,
  `BEGGINING_BALANCE_DATE` date NOT NULL,
  `COMPANY_LOGO` varchar(255) NOT NULL,
  `BRANCH` varchar(255) NOT NULL,
  `ADDRESS` varchar(255) NOT NULL,
  `ZIPCODE` varchar(255) NOT NULL,
  `TIN` varchar(255) NOT NULL,
  `GENERAL_MANAGER` varchar(255) NOT NULL,
  `COMPANY_DIR` varchar(255) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;


INSERT INTO inventory.company_setup VALUES
("2","FARMACIA CJ MAR","FCM4132021","2021-01-01","104282431_541164466561022_2349703798013229185_n.jpg","MAIN BRANCH","CANLAON CITY","","","2","FARMACIACJMAR");




 CREATE TABLE `inventory`.`item_details` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `DOC_ID` varchar(255) NOT NULL,
  `ITEM_CODE` varchar(255) NOT NULL,
  `QUANTITY` float NOT NULL,
  `REGULAR` float NOT NULL,
  `DEAL` float NOT NULL,
  `UNIT_CONVERSION_ID` varchar(255) NOT NULL,
  `COST_PER_UNIT` float NOT NULL,
  `SELLING_PRICE_PER_UNIT` float NOT NULL,
  `TOTAL_COST` float NOT NULL,
  `TOTAL_PRICE` float NOT NULL,
  `DATE_ENCODED` date NOT NULL,
  `COMPANY_CODE` varchar(255) NOT NULL,
  `STOCK_IN_OUT` tinyint(1) NOT NULL,
  `WAREHOUSE_CODE` varchar(255) NOT NULL,
  `LOT_NUMBER` varchar(255) NOT NULL,
  `EXPIRY_DATE` date NOT NULL,
  `DISCOUNT` float NOT NULL,
  `DISCOUNT_TYPE` varchar(255) NOT NULL,
  `DISCOUNT_PERCENT` varchar(255) NOT NULL,
  `VAT_PERCENT` int(11) NOT NULL,
  `VAT_AMT` float NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=latin1;


INSERT INTO inventory.item_details VALUES
("48","Delivery1640053048","ITEM1637676185","100","0","100","ITEM1637676185_UNIT1637676185","10","12.75","1000","1275","0000-00-00","FCM4132021","1","W01","","2100-01-01","0","","","0","0"),
("49","Delivery1640053048","ITEM1638954410","100","0","100","ITEM1638954410_UNIT1638954410","10","10","1000","1000","0000-00-00","FCM4132021","1","W01","","2100-02-02","0","","","0","0"),
("50","Delivery1640053048","ITEM1637676113","100","0","100","ITEM1637676113_UNIT1637676113","12","12","1200","1200","0000-00-00","FCM4132021","1","W01","","2100-03-03","0","","","0","0"),
("51","Delivery1640053128","ITEM1637676185","100","0","100","ITEM1637676185_UNIT1637676185","10","12.75","1000","1275","0000-00-00","FCM4132021","1","W01","","2100-04-04","0","","","0","0"),
("52","Delivery1640053128","ITEM1638954410","100","0","100","ITEM1638954410_UNIT1638954410","10","10","1000","1000","0000-00-00","FCM4132021","1","W01","","2100-05-05","0","","","0","0"),
("53","Delivery1640053128","ITEM1637676113","100","0","100","ITEM1637676113_UNIT1637676113","12","12","1200","1200","0000-00-00","FCM4132021","1","W01","","2100-06-06","0","","","0","0"),
("54","OR1640053179","ITEM1638954410","20","0","20","ITEM1638954410_UNIT1638954427","5","10","100","200","2021-12-21","FCM4132021","0","","","2100-05-05","0","NONE","0","0","0"),
("56","OR1640079318","ITEM1637676185","30","0","30","ITEM1637676185_UNIT1637676197","5","10","150","300","2021-12-21","FCM4132021","0","","","2100-04-04","0","NONE","0","0","0"),
("57","OR1640079613","ITEM1638954410","37","0","37","ITEM1638954410_UNIT1638954427","5","10","185","370","2021-12-21","FCM4132021","0","","","2100-05-05","0","NONE","0","0","0"),
("58","Return by Customer1640359633","ITEM1638954410","100","0","100","ITEM1638954410_UNIT1638954410","10","10","1000","1000","0000-00-00","FCM4132021","1","W01","","2022-01-22","0","","","0","0"),
("59","Return by Customer1640362022","ITEM1638954410","1","0","100","ITEM1638954410_UNIT1638954410","10","10","10","10","0000-00-00","FCM4132021","1","W01","","2022-01-22","0","","","0","0"),
("60","Return by Customer1640362102","ITEM1637676113","100","0","100","ITEM1637676113_UNIT1637676113","12","12","1200","1200","0000-00-00","FCM4132021","1","W01","","2022-01-22","0","","","0","0"),
("61","Return by Customer1640362157","ITEM1637676113","27","0","27","ITEM1637676113_UNIT1637676113","12","12","324","324","0000-00-00","FCM4132021","1","W01","","2022-01-15","0","","","0","0"),
("62","Return by Customer1640362241","ITEM1638954410","27","0","27","ITEM1638954410_UNIT1638954410","10","10","270","270","0000-00-00","FCM4132021","1","W01","","2022-01-13","0","","","0","0"),
("63","Return to Supplier1640368339","ITEM1637676113","20","0","20","ITEM1637676113_UNIT1637676113","12","12","240","240","0000-00-00","FCM4132021","0","W01","","2022-01-22","0","","","0","0"),
("64","Delivery1641206103","ITEM1638954410","10","0","10","ITEM1638954410_UNIT1638954410","10","10","100","100","0000-00-00","FCM4132021","1","W01","","2025-01-01","0","","","0","0"),
("65","OR1641654483","ITEM1637676185","50","0","50","ITEM1637676185_UNIT1637676185","5","12.75","250","637.5","2022-01-08","FCM4132021","0","","","2100-04-04","0","NONE","0","0","0"),
("66","OR1641654483","ITEM1637676113","30","0","30","ITEM1637676113_UNIT1637676113","2.5","12","75","360","2022-01-08","FCM4132021","0","","","2100-03-03","0","NONE","0","0","0"),
("67","OR1641654545","ITEM1637676185","20","0","20","ITEM1637676185_UNIT1637676185","5","12.75","100","255","2022-01-08","FCM4132021","0","","","2100-04-04","0","NONE","0","0","0"),
("68","OR1641654545","ITEM1637676113","25","0","25","ITEM1637676113_UNIT1637676113","2.5","12","62.5","300","2022-01-08","FCM4132021","0","","","2100-06-06","0","NONE","0","0","0"),
("69","OR1641654602","ITEM1638954410","25","0","25","ITEM1638954410_UNIT1638954410","5","10","125","250","2022-01-08","FCM4132021","0","","","2100-02-02","0","NONE","0","0","0"),
("70","Delivery1641718231","ITEM1638954399","1000","0","1000","ITEM1638954399_UNIT1638954399","1000","1000","1000000","1000000","0000-00-00","FCM4132021","1","W01","","2055-02-02","0","","","0","0"),
("71","OR1641718259","ITEM1638954399","5","0","5","ITEM1638954399_UNIT1638954401","500","750","2500","3750","2022-01-09","FCM4132021","0","","","2055-02-02","0","NONE","0","0","0"),
("72","OR1641719392","ITEM1638954399","100","0","100","ITEM1638954399_UNIT1638954401","500","750","50000","75000","2022-01-09","FCM4132021","0","","","2055-02-02","0","NONE","0","0","0"),
("73","OR1641743754","ITEM1637676113","11","0","11","ITEM1637676113_UNIT1637676113","2.5","12","27.5","132","2022-01-09","FCM4132021","0","","","2100-06-06","0","NONE","0","0","0"),
("74","OR1641743754","ITEM1637676185","12","0","12","ITEM1637676185_UNIT1637676185","5","12.75","60","153","2022-01-09","FCM4132021","0","","","2100-04-04","0","NONE","0","0","0"),
("75","OR1641743786","ITEM1637676185","10","0","10","ITEM1637676185_UNIT1637676185","5","12.75","50","127.5","2022-01-09","FCM4132021","0","","","2100-04-04","0","NONE","0","0","0"),
("76","OR1641743803","ITEM1638954410","12","0","12","ITEM1638954410_UNIT1638954410","5","10","60","120","2022-01-09","FCM4132021","0","","","2100-05-05","0","NONE","0","0","0");




 CREATE TABLE `inventory`.`item_in_warehouse` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `H` int(11) NOT NULL,
  `DOC_ID` varchar(255) NOT NULL,
  `ITEM_CODE` varchar(255) NOT NULL,
  `WAREHOUSE_CODE` varchar(255) NOT NULL,
  `QUANTITY` varchar(255) NOT NULL,
  `B_QUANTITY` float NOT NULL,
  `TOTAL_QUANTITY` varchar(255) NOT NULL,
  `UNIT_CONVERSION_ID` varchar(255) NOT NULL,
  `QTY_AS_OF` date NOT NULL,
  `COMPANY_CODE` varchar(255) NOT NULL,
  `LOT_NUMBER` varchar(255) NOT NULL,
  `EXPIRY_DATE` date NOT NULL,
  `IS_CANCELLED` tinyint(1) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=1378 DEFAULT CHARSET=latin1;


INSERT INTO inventory.item_in_warehouse VALUES
("1176","0","","ITEM1637676113","W01","0","0","0","ITEM1637676113_UNIT1637676113","2021-11-23","FCM4132021","","0000-00-00","0"),
("1177","0","","ITEM1637676185","W01","0","0","0","ITEM1637676185_UNIT1637676185","2021-11-23","FCM4132021","","0000-00-00","0"),
("1246","0","","ITEM1638954399","W01","0","0","0","ITEM1638954399_UNIT1638954399","2021-12-08","FCM4132021","","0000-00-00","0"),
("1247","0","","ITEM1638954410","W01","0","0","0","ITEM1638954410_UNIT1638954410","2021-12-08","FCM4132021","","0000-00-00","0"),
("1346","0","Delivery1640053048","ITEM1637676185","W01","100","100","100","ITEM1637676185_UNIT1637676185","2021-12-21","FCM4132021","","2100-01-01","0"),
("1347","0","Delivery1640053048","ITEM1638954410","W01","100","100","100","ITEM1638954410_UNIT1638954410","2021-12-21","FCM4132021","","2100-02-02","0"),
("1348","0","Delivery1640053048","ITEM1637676113","W01","100","100","100","ITEM1637676113_UNIT1637676113","2021-12-21","FCM4132021","","2100-03-03","0"),
("1349","0","Delivery1640053128","ITEM1637676185","W01","100","100","200","ITEM1637676185_UNIT1637676185","2021-12-21","FCM4132021","","2100-04-04","0"),
("1350","0","Delivery1640053128","ITEM1638954410","W01","100","100","200","ITEM1638954410_UNIT1638954410","2021-12-21","FCM4132021","","2100-05-05","0"),
("1351","0","Delivery1640053128","ITEM1637676113","W01","100","100","200","ITEM1637676113_UNIT1637676113","2021-12-21","FCM4132021","","2100-06-06","0"),
("1352","0","OR1640053179","ITEM1638954410","W01","0","20","0","ITEM1638954410_UNIT1638954427","2021-12-21","FCM4132021","","2100-05-05","1"),
("1354","0","OR1640079318","ITEM1637676185","W01","0","30","0","ITEM1637676185_UNIT1637676197","2021-12-21","FCM4132021","","2100-04-04","1"),
("1355","0","OR1640079613","ITEM1638954410","W01","96.3","37","196.3","ITEM1638954410_UNIT1638954427","2021-12-21","FCM4132021","","2100-05-05","0"),
("1356","0","Return by Customer1640359633","ITEM1638954410","W01","0","100","0","ITEM1638954410_UNIT1638954410","2021-12-24","FCM4132021","","2022-01-22","1"),
("1357","0","Return by Customer1640362022","ITEM1638954410","W01","0","1","0","ITEM1638954410_UNIT1638954410","2021-12-25","FCM4132021","","2022-01-22","1"),
("1358","0","Return by Customer1640362102","ITEM1637676113","W01","100","100","300","ITEM1637676113_UNIT1637676113","2021-12-25","FCM4132021","","2022-01-22","0"),
("1359","0","Return by Customer1640362157","ITEM1637676113","W01","27","27","327","ITEM1637676113_UNIT1637676113","2021-12-25","FCM4132021","","2022-01-15","0"),
("1360","0","Return by Customer1640362241","ITEM1638954410","W01","27","27","223.3","ITEM1638954410_UNIT1638954410","2021-12-25","FCM4132021","","2022-01-13","0"),
("1361","0","Return to Supplier1640368339","ITEM1637676113","W01","80","20","307","ITEM1637676113_UNIT1637676113","2021-12-25","FCM4132021","","2022-01-22","0"),
("1362","0","Delivery1641206103","ITEM1638954410","W01","10","10","233.3","ITEM1638954410_UNIT1638954410","2022-01-03","FCM4132021","","2025-01-01","0"),
("1363","0","OR1641654483","ITEM1637676185","W01","50","50","150","ITEM1637676185_UNIT1637676185","2022-01-08","FCM4132021","","2100-04-04","0"),
("1364","0","OR1641654483","ITEM1637676113","W01","70","30","277","ITEM1637676113_UNIT1637676113","2022-01-08","FCM4132021","","2100-03-03","0"),
("1365","0","OR1641654545","ITEM1637676185","W01","30","20","130","ITEM1637676185_UNIT1637676185","2022-01-08","FCM4132021","","2100-04-04","0"),
("1366","0","OR1641654545","ITEM1637676113","W01","75","25","252","ITEM1637676113_UNIT1637676113","2022-01-08","FCM4132021","","2100-06-06","0"),
("1367","0","OR1641654602","ITEM1638954410","W01","75","25","208.3","ITEM1638954410_UNIT1638954410","2022-01-08","FCM4132021","","2100-02-02","0"),
("1368","0","Delivery1641718231","ITEM1638954399","W01","1000","1000","1000","ITEM1638954399_UNIT1638954399","2022-01-09","FCM4132021","","2055-02-02","0"),
("1369","0","OR1641718259","ITEM1638954399","W01","999.95","5","999.95","ITEM1638954399_UNIT1638954401","2022-01-09","FCM4132021","","2055-02-02","0"),
("1370","0","OR1641719392","ITEM1638954399","W01","998.95","100","998.95","ITEM1638954399_UNIT1638954401","2022-01-09","FCM4132021","","2055-02-02","0"),
("1371","0","OR1641743754","ITEM1637676113","W01","64","11","241","ITEM1637676113_UNIT1637676113","2022-01-09","FCM4132021","","2100-06-06","0"),
("1372","0","OR1641743754","ITEM1637676185","W01","18","12","118","ITEM1637676185_UNIT1637676185","2022-01-09","FCM4132021","","2100-04-04","0"),
("1373","0","OR1641743786","ITEM1637676185","W01","8","10","108","ITEM1637676185_UNIT1637676185","2022-01-09","FCM4132021","","2100-04-04","0"),
("1374","0","OR1641743803","ITEM1638954410","W01","84.3","12","196.3","ITEM1638954410_UNIT1638954410","2022-01-09","FCM4132021","","2100-05-05","0"),
("1375","0","","ITEM1641829357","W01","0","0","0","ITEM1641829357_UNIT1641829357","2022-01-10","FCM4132021","","0000-00-00","0"),
("1376","0","","ITEM1641829389","W01","0","0","0","ITEM1641829389_UNIT1641829389","2022-01-10","FCM4132021","","0000-00-00","0"),
("1377","0","","ITEM1641829455","W01","0","0","0","ITEM1641829455_UNIT1641829455","2022-01-10","FCM4132021","","0000-00-00","0");




 CREATE TABLE `inventory`.`item_master_data` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `ITEM_CODE` varchar(255) NOT NULL,
  `ITEM_NAME` varchar(255) NOT NULL,
  `SUPPLIER_CODE` varchar(255) NOT NULL,
  `UNIT_CONVERSION_ID` varchar(255) NOT NULL,
  `DATE_ENCODED` date NOT NULL,
  `COMPANY_CODE` varchar(255) NOT NULL,
  `ITEM_IMAGE` varchar(255) NOT NULL,
  `ACCOUNT_CODE` varchar(255) NOT NULL,
  `ITEM_DESCRIPTION` varchar(255) NOT NULL,
  `ALERT_QTY` float NOT NULL,
  `EXPIRY_DATE` date NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=latin1;


INSERT INTO inventory.item_master_data VALUES
("85","ITEM1637676113","BIOGESIC","SUPPLIER01","","2021-11-23","FCM4132021","/inventory/sources/complist/FARMACIACJMAR/itemimage/ITEM1637676113/profpic/aDdbvPK_460s.jpg","","It is an item","12","0000-00-00"),
("86","ITEM1637676185","LOPERAMIDE","SUPPLIER01","","2021-11-23","FCM4132021","/inventory/sources/complist/FARMACIACJMAR/itemimage/ITEM1637676185/profpic/DJJJ.jpg","","It is an item","0","0000-00-00"),
("92","ITEM1638954399","ITEM","SUPPLIER1611190040","","2021-12-08","FCM4132021","/inventory/sources/complist/FARMACIACJMAR/itemimage/ITEM1638954399/profpic/255425942_202040435409848_1198022752162174300_n.png","","It is an item","0","0000-00-00"),
("93","ITEM1638954410","LOSARTAN 30MG","SUPPLIER1611190040","","2021-12-08","FCM4132021","/inventory/sources/complist/FARMACIACJMAR/itemimage/ITEM1638954410/profpic/263133168_965152774078976_6292773550898179019_n.png","","It is an item","15","0000-00-00"),
("94","ITEM1641829357","THE WOK","SUPPLIER1611190040","","2022-01-10","FCM4132021","/inventory/sources/complist/FARMACIACJMAR/itemimage/ITEM1641829357/profpic/Untitled.png","","It is an item","0","0000-00-00"),
("95","ITEM1641829389","ITEMX","SUPPLIER1611190040","","2022-01-10","FCM4132021","/inventory/sources/complist/FARMACIACJMAR/itemimage/ITEM1641829389/profpic/Untitled.png","","It is an item","0","0000-00-00"),
("96","ITEM1641829455","ITEM","SUPPLIER1611190040","","2022-01-10","FCM4132021","/inventory/sources/complist/FARMACIACJMAR/itemimage/ITEM1641829455/profpic/Untitled.png","","It is an item","0","0000-00-00");




 CREATE TABLE `inventory`.`latest_activity` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `TYPE` varchar(255) NOT NULL,
  `MESSAGE` varchar(255) NOT NULL,
  `DATE` date NOT NULL,
  `TIME` time NOT NULL,
  `POSTED_BY` varchar(255) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4;


INSERT INTO inventory.latest_activity VALUES
("39","SalesInvoice","Has transacted <a href=\'javascript:void(0);\' data-event=\'dashboard.click.viewreceipt\' data-params=\'{\"orno\":\"OR1640053179\"}\'>OR1640053179</a> with amount of <b>200</b> , change: <b>0</b>, amount received: <b>200</b>.","2021-12-21","10:20:02","2"),
("40","SalesInvoice","Has transacted <a href=\'javascript:void(0);\' data-event=\'dashboard.click.viewreceipt\' data-params=\'{\"orno\":\"OR1640053281\"}\'>OR1640053281</a> with amount of <b>400</b> , change: <b>0</b>, amount received: <b>400</b>.","2021-12-21","10:21:49","2"),
("41","SalesInvoice","Has transacted <a href=\'javascript:void(0);\' data-event=\'dashboard.click.viewreceipt\' data-params=\'{\"orno\":\"OR1640079318\"}\'>OR1640079318</a> with amount of <b>300</b> , change: <b>0</b>, amount received: <b>300</b>.","2021-12-21","17:35:35","2"),
("42","SalesInvoice","Has transacted <a href=\'javascript:void(0);\' data-event=\'dashboard.click.viewreceipt\' data-params=\'{\"orno\":\"OR1640079613\"}\'>OR1640079613</a> with amount of <b>370</b> , change: <b>5</b>, amount received: <b>375</b>.","2021-12-21","17:40:32","2"),
("43","SalesInvoice","Has transacted <a href=\'javascript:void(0);\' data-event=\'dashboard.click.viewreceipt\' data-params=\'{\"orno\":\"OR1641654483\"}\'>OR1641654483</a> with amount of <b>997.5</b> , change: <b>2.5</b>, amount received: <b>1000</b>.","2022-01-08","23:09:01","2"),
("44","SalesInvoice","Has transacted <a href=\'javascript:void(0);\' data-event=\'dashboard.click.viewreceipt\' data-params=\'{\"orno\":\"OR1641654545\"}\'>OR1641654545</a> with amount of <b>555</b> , change: <b>5</b>, amount received: <b>560</b>.","2022-01-08","23:09:49","2"),
("45","SalesInvoice","Has transacted <a href=\'javascript:void(0);\' data-event=\'dashboard.click.viewreceipt\' data-params=\'{\"orno\":\"OR1641654602\"}\'>OR1641654602</a> with amount of <b>250</b> , change: <b>10</b>, amount received: <b>260</b>.","2022-01-08","23:10:44","2"),
("46","SalesInvoice","Has transacted <a href=\'javascript:void(0);\' data-event=\'dashboard.click.viewreceipt\' data-params=\'{\"orno\":\"OR1641718259\"}\'>OR1641718259</a> with amount of <b>3750</b> , change: <b>250</b>, amount received: <b>4000</b>.","2022-01-09","16:51:42","2"),
("47","SalesInvoice","Has transacted <a href=\'javascript:void(0);\' data-event=\'dashboard.click.viewreceipt\' data-params=\'{\"orno\":\"OR1641719392\"}\'>OR1641719392</a> with amount of <b>75000</b> , change: <b>0</b>, amount received: <b>75000</b>.","2022-01-09","17:16:40","2"),
("48","SalesInvoice","Has transacted <a href=\'javascript:void(0);\' data-event=\'dashboard.click.viewreceipt\' data-params=\'{\"orno\":\"OR1641743754\"}\'>OR1641743754</a> with amount of <b>285</b> , change: <b>5</b>, amount received: <b>290</b>.","2022-01-09","23:56:22","2"),
("49","SalesInvoice","Has transacted <a href=\'javascript:void(0);\' data-event=\'dashboard.click.viewreceipt\' data-params=\'{\"orno\":\"OR1641743786\"}\'>OR1641743786</a> with amount of <b>127.5</b> , change: <b>2.5</b>, amount received: <b>130</b>.","2022-01-09","23:56:40","2"),
("50","SalesInvoice","Has transacted <a href=\'javascript:void(0);\' data-event=\'dashboard.click.viewreceipt\' data-params=\'{\"orno\":\"OR1641743803\"}\'>OR1641743803</a> with amount of <b>120</b> , change: <b>0</b>, amount received: <b>120</b>.","2022-01-09","23:57:08","2");




 CREATE TABLE `inventory`.`maintenance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `db_to_backup` varchar(255) NOT NULL,
  `back_up_time` time NOT NULL,
  `IS_AUTO_BACK_UP_RUNNING` tinyint(1) NOT NULL,
  `COMPANY_ID` varchar(255) NOT NULL,
  `COMPANY_DIR` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;


INSERT INTO inventory.maintenance VALUES
("1","{\"inventory\":1}","13:00:00","1","FCM4132021","FARMACIACJMAR");




 CREATE TABLE `inventory`.`price_list` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `ITEM_CODE` varchar(255) NOT NULL,
  `DEFAULT_PRICE` tinyint(1) NOT NULL,
  `PRICE_PER_UNIT` float NOT NULL,
  `COST_PER_UNIT` float NOT NULL,
  `ITEM_UNIT` varchar(255) NOT NULL,
  `SUPPLIER_CODE` varchar(255) NOT NULL,
  `COMPANY_CODE` varchar(255) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;






 CREATE TABLE `inventory`.`sales_invoice` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `DATE_TRANSACTION` varchar(255) NOT NULL,
  `TIME_TRANSACTION` time NOT NULL,
  `ORNO` varchar(255) NOT NULL,
  `TOTAL_AMOUNT` float NOT NULL,
  `TOTAL_VAT` float NOT NULL,
  `TOTAL_DISCOUNT` float NOT NULL,
  `RCVD_PAYMENT` float NOT NULL,
  `CHANGE_AMT` float NOT NULL,
  `CASHIER` varchar(255) NOT NULL,
  `STATUS` varchar(255) NOT NULL,
  `DISCOUNT_TYPE` varchar(255) NOT NULL,
  `DISCOUNT_PERCENT` varchar(255) NOT NULL,
  `VAT_PERCENT` varchar(255) NOT NULL,
  `PAYMENT_MODE` varchar(255) NOT NULL,
  `CANCELLED_BY` varchar(255) NOT NULL,
  `CANCELLED_DATE` varchar(255) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `ORNO` (`ORNO`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4;


INSERT INTO inventory.sales_invoice VALUES
("43","2021-12-21","10:20:02","OR1640053179","200","0","0","200","0","2","Close","NONE","0","0","cash","2","2021-12-21"),
("45","2021-12-21","17:35:35","OR1640079318","300","0","0","300","0","2","Close","NONE","0","0","cash","2","2021-12-21"),
("46","2021-12-21","17:40:32","OR1640079613","370","0","0","375","5","2","Close","NONE","0","0","cash","",""),
("47","2022-01-08","23:09:01","OR1641654483","997.5","0","0","1000","2.5","2","Close","NONE","0","0","cash","",""),
("48","2022-01-08","23:09:49","OR1641654545","555","0","0","560","5","2","Close","NONE","0","0","cash","",""),
("49","2022-01-08","23:10:44","OR1641654602","250","0","0","260","10","2","Close","NONE","0","0","cash","",""),
("50","2022-01-09","16:51:42","OR1641718259","3750","0","0","4000","250","2","Close","NONE","0","0","cash","",""),
("51","2022-01-09","17:16:40","OR1641719392","75000","0","0","75000","0","2","Close","NONE","0","0","cash","",""),
("52","2022-01-09","23:56:22","OR1641743754","285","0","0","290","5","2","Close","NONE","0","0","cash","",""),
("53","2022-01-09","23:56:40","OR1641743786","127.5","0","0","130","2.5","2","Close","NONE","0","0","cash","",""),
("54","2022-01-09","23:57:08","OR1641743803","120","0","0","120","0","2","Close","NONE","0","0","cash","","");




 CREATE TABLE `inventory`.`supplier` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `SUPPLIER_NAME` varchar(25) NOT NULL,
  `SUPPLIER_CODE` varchar(255) NOT NULL,
  `SUPPLIER_ADDRESS` varchar(255) NOT NULL,
  `DATE_ENCODED` date NOT NULL,
  `COMPANY_CODE` varchar(255) NOT NULL,
  `IMG` varchar(255) NOT NULL,
  `ACCOUNT_CODE` varchar(255) NOT NULL,
  `DESCRIPTION` varchar(255) NOT NULL,
  `TYPE` varchar(255) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;


INSERT INTO inventory.supplier VALUES
("1","MAIN SUPPLIERs","SUPPLIER01","BACOLOD","2021-01-03","VFC0129122020","","0-0000","A Distributor","Customer"),
("5","MY CUSTOMER","SUPPLIER1611190040","MANILA","2021-01-21","VFC0129122020","","0-0000","A Distributor","Supplier"),
("6","CANLAON PHARMACEUTICALS","SUPPLIER1638971385","CANLAON CITY","2021-12-08","FCM4132021","","0-0000","A trusted Business Partner","Supplier");




 CREATE TABLE `inventory`.`unit` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `UNIT_CONVERSION_ID` varchar(255) NOT NULL,
  `UNIT_NAME` varchar(255) NOT NULL,
  `COST_PER_UNIT` float NOT NULL,
  `SELLING_PRICE_PER_UNIT` float NOT NULL,
  `ITEM_CODE` varchar(255) NOT NULL,
  `IS_EQUAL_TO` varchar(255) NOT NULL,
  `QTY` int(11) NOT NULL,
  `PARENT_QTY` int(11) NOT NULL,
  `IS_BASE_UNIT` tinyint(1) NOT NULL,
  `HEIRARCHY` int(11) NOT NULL,
  `DATE_ENCODED` date NOT NULL,
  `COMPANY_CODE` varchar(255) NOT NULL,
  `SUPPLIER_CODE` varchar(255) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=315 DEFAULT CHARSET=latin1;


INSERT INTO inventory.unit VALUES
("258","ITEM1638953714_UNIT1638953714","BOX","100","125.55","ITEM1638953714","","1","0","0","0","2021-12-08","FCM4132021","SUPPLIER01"),
("304","ITEM1637676113_UNIT1637676113","BOX","12","12","ITEM1637676113","","1","0","0","0","2021-11-23","FCM4132021","SUPPLIER01"),
("305","ITEM1637676113_UNIT1637676153","PIECE","2.5","5.5","ITEM1637676113","BOX","10","1","0","1","2021-11-23","FCM4132021","SUPPLIER01"),
("306","ITEM1638954410_UNIT1638954410","BOX","10","10","ITEM1638954410","","1","0","0","0","2021-12-08","FCM4132021","SUPPLIER1611190040"),
("307","ITEM1638954410_UNIT1638954427","PIECE","5","10","ITEM1638954410","BOX","10","2","0","1","2021-12-08","FCM4132021","SUPPLIER1611190040"),
("308","ITEM1637676185_UNIT1637676185","BOX","10","12.75","ITEM1637676185","","1","0","0","0","2021-11-23","FCM4132021","SUPPLIER01"),
("309","ITEM1637676185_UNIT1637676197","PIECE","5","10","ITEM1637676185","BOX","10","1","0","1","2021-11-23","FCM4132021","SUPPLIER01"),
("310","ITEM1638954399_UNIT1638954399","BOX","1000","1000","ITEM1638954399","","1","0","0","0","2021-12-08","FCM4132021","SUPPLIER1611190040"),
("311","ITEM1638954399_UNIT1638954401","PIECE","500","750","ITEM1638954399","BOX","100","1","0","1","2021-12-08","FCM4132021","SUPPLIER1611190040"),
("312","ITEM1641829357_UNIT1641829357","PIECE","10","12","ITEM1641829357","","1","0","0","0","2022-01-10","FCM4132021",""),
("313","ITEM1641829389_UNIT1641829389","Base Unit","1","1","ITEM1641829389","","1","0","0","0","2022-01-10","FCM4132021",""),
("314","ITEM1641829455_UNIT1641829455","Base Unit","1","1","ITEM1641829455","","1","0","0","0","2022-01-10","FCM4132021","");




 CREATE TABLE `inventory`.`user_setup` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `FIRSTNAME` varchar(255) NOT NULL,
  `MIDDLENAME` varchar(255) NOT NULL,
  `LASTNAME` varchar(255) NOT NULL,
  `USERNAME` varchar(255) NOT NULL,
  `PASSWORD` varchar(255) NOT NULL,
  `POSITION` varchar(255) NOT NULL,
  `DESIGNATION` varchar(255) NOT NULL,
  `ADDRESS` varchar(255) NOT NULL,
  `DATE_ENCODED` date NOT NULL,
  `PREVILEDGE_SETUP_CODE` varchar(255) NOT NULL,
  `COMPANY_CODE` varchar(255) NOT NULL,
  `STATUS` varchar(255) NOT NULL,
  `EMAIL` varchar(255) NOT NULL,
  `CONTACT` varchar(255) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;


INSERT INTO inventory.user_setup VALUES
("2","CRISVAILE","","MESIAS RPH","crisvaile","mesias","Manager","Admin","","2021-04-13","","FCM4132021","Active","",""),
("3","KINNE","","MESIAS RPH","kinne","mesias","owner","Admin","","2021-04-13","","FCM4132021","Active","",""),
("6","RICOLITO","APAYART","CANTORIAS","ricolito","cantorias","Manager","Admin","","0000-00-00","","FCM4132021","Active","","");




 CREATE TABLE `inventory`.`warehouse` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `WAREHOUSE_NAME` varchar(255) NOT NULL,
  `WAREHOUSE_CODE` varchar(255) NOT NULL,
  `ADDRESS` varchar(255) NOT NULL,
  `DATE_ENCODED` date NOT NULL,
  `COMPANY_CODE` varchar(255) NOT NULL,
  `IMG` varchar(255) NOT NULL,
  `DESCRIPTION` varchar(255) NOT NULL,
  `ACCOUNT_CODE` varchar(255) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;


INSERT INTO inventory.warehouse VALUES
("1","MAIN WAREHOUSE","W01","BRGY. ALIJIS BACOLOD CITY","0000-00-00","VFC0129122020","","Our storage for our products","0-0000"),
("4","OUR OTHER WAREHOUSE","WAREHOUSE1611068096","MINDANAO","2021-01-19","VFC0129122020","","Our storage for our products","0-0000");




/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;