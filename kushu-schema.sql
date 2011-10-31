-- phpMyAdmin SQL Dump
-- version 3.3.2deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Oct 31, 2011 at 03:41 PM
-- Server version: 5.1.41
-- PHP Version: 5.3.2-1ubuntu4.9

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `kushu`
--

-- --------------------------------------------------------

--
-- Table structure for table `Card`
--

CREATE TABLE IF NOT EXISTS `Card` (
  `CARD_ID` int(12) NOT NULL AUTO_INCREMENT,
  `DECK_ID` int(12) DEFAULT NULL,
  `front` text CHARACTER SET utf8,
  `back` text CHARACTER SET utf8,
  `source` text NOT NULL,
  PRIMARY KEY (`CARD_ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=305 ;

-- --------------------------------------------------------

--
-- Table structure for table `Deck`
--

CREATE TABLE IF NOT EXISTS `Deck` (
  `DECK_ID` int(12) NOT NULL AUTO_INCREMENT,
  `OWNER_USERID` int(11) NOT NULL,
  `deck_name` varchar(255) CHARACTER SET utf8 NOT NULL,
  `summary` text NOT NULL,
  `reversible` tinyint(1) NOT NULL DEFAULT '0',
  `deck_image` varchar(255) NOT NULL DEFAULT 'noimage.png',
  PRIMARY KEY (`DECK_ID`),
  UNIQUE KEY `DECK_NAME` (`deck_name`)
) ENGINE=MyISAM  DEFAULT CHARSET=ucs2 AUTO_INCREMENT=17 ;

-- --------------------------------------------------------

--
-- Table structure for table `DeckState`
--

CREATE TABLE IF NOT EXISTS `DeckState` (
  `DECKSTATE_ID` int(11) NOT NULL AUTO_INCREMENT,
  `USER_ID` int(11) NOT NULL,
  `DECK_ID` int(11) NOT NULL,
  `date_modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `serialized_state` text NOT NULL,
  PRIMARY KEY (`DECKSTATE_ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=86 ;

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE IF NOT EXISTS `User` (
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `USER_ID` int(12) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`USER_ID`),
  UNIQUE KEY `username` (`username`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=15 ;
