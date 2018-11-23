-- MySQL dump 10.13  Distrib 8.0.12, for macos10.13 (x86_64)
--
-- Host: localhost    Database: things
-- ------------------------------------------------------
-- Server version	8.0.12

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8mb4 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(40) NOT NULL,
  `content` text,
  `uid` varchar(40) NOT NULL,
  `moment` varchar(40) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,'wuli的发版方法','<p>asdsad</p><p>asda</p><p>asd</p><p>asdasdasd</p><p>asd<br></p><p>as</p><p>asd</p><p>aasd</p><p><br></p><p>a</p><p>sdas</p><p>sa</p><p>dsa</p><p>dsa</p><p>dsa</p><p>d</p><p>sad</p><p>asd</p><p>sada</p><p>d</p>','1','2018-11-21 05:59:00'),(2,'啊sad','<p>萨达所</p>','1','2018-11-21 06:02:03'),(3,'水电费','<pre><code class=\"lang-css\">a {\n    text-decoration: none\n}\n\narticle,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section {\n    display: block\n}\nhtml{\n    height: 100%;\n}\nbody {\n    line-height: 1;\n    height: 100%;\n}\n\ntable {\n    border-collapse: collapse;\n    border-spacing: 0\n}<br></code></pre>','1','2018-11-21 06:52:02'),(4,'面向未来的前端数据流框架 - dob','<p>我们大部分对内产品，都广泛使用了 <a href=\"https://link.juejin.im?target=https%3A%2F%2Fgithub.com%2Fascoders%2Fdob\" target=\"_blank\">dob</a> 管理前端数据流，下面隆重介绍一下。</p><p>dob 是利用 proxy 实现的数据依赖追踪工具，利用 <a href=\"https://link.juejin.im?target=https%3A%2F%2Fgithub.com%2Fdobjs%2Fdob-react\" target=\"_blank\">dob-react</a> 与 react 结合。</p><p>dob 的核心思想大量借鉴了 <a href=\"https://link.juejin.im?target=https%3A%2F%2Fgithub.com%2Fmobxjs%2Fmobx\" target=\"_blank\">mobx</a>，但是从实现原理、使用便捷性，以及调试工具都做了大量优化。</p><pre><code class=\"lang-js\">import { observable, observe } from \"dob\"\n\nconst obj = observable({ a: 1, b: 1 })\n\nobserve(() =&gt; {\n    console.log(obj.a)\n})</code></pre><p>测试一下</p><pre><code class=\"lang-js\">const fastJson = require(\'fast-json-stringify\')\nconst stringify = fastJson({\n&nbsp; &nbsp; title: \'Example Schema\',\n&nbsp; &nbsp; type: \'object\',\n&nbsp; &nbsp; properties: {\n&nbsp; &nbsp; &nbsp; &nbsp; name: { type: \'string\' },\n&nbsp; &nbsp; &nbsp; &nbsp; age: { type: \'integer\' },\n&nbsp; &nbsp; &nbsp; &nbsp; books: {\n&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; type: \'array\',\n&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; items: {\n&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; type: \'string\',\n&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; uniqueItems: true\n&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; }\n&nbsp; &nbsp; &nbsp; &nbsp; }\n&nbsp; &nbsp; }\n})\n\nconsole.log(stringify({\n&nbsp; &nbsp; name: \'Starkwang\',\n&nbsp; &nbsp; age: 23,\n&nbsp; &nbsp; books: [\'C++ Primier\', \'響け！ユーフォニアム～\']\n}))</code></pre>','1','2018-11-21 08:06:18');
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `pass` varchar(40) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'wang_hes','d4543a62081ecf5798e9bb48af732f21'),(2,'asd','f03a8e888b8824d51d7cb275e0114b91');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-11-23 11:01:02
