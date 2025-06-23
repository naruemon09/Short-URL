--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-06-23 18:52:05

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 16430)
-- Name: clicks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clicks (
    short_url character varying(45) NOT NULL,
    clicked_at timestamp without time zone NOT NULL,
    username character varying(10) NOT NULL
);


ALTER TABLE public.clicks OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16423)
-- Name: url; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.url (
    short_url character varying(45) NOT NULL,
    qr_code text NOT NULL,
    original_url character varying(255) NOT NULL
);


ALTER TABLE public.url OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16416)
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    username character varying(10) NOT NULL,
    email character varying(45) DEFAULT NULL::character varying,
    password character varying(12) DEFAULT NULL::character varying,
    create_at timestamp without time zone
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- TOC entry 4756 (class 2606 OID 16434)
-- Name: clicks clicks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clicks
    ADD CONSTRAINT clicks_pkey PRIMARY KEY (short_url);


--
-- TOC entry 4754 (class 2606 OID 16429)
-- Name: url url_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.url
    ADD CONSTRAINT url_pkey PRIMARY KEY (short_url);


--
-- TOC entry 4752 (class 2606 OID 16422)
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (username);


--
-- TOC entry 4757 (class 2606 OID 16435)
-- Name: clicks clicks_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clicks
    ADD CONSTRAINT clicks_ibfk_1 FOREIGN KEY (short_url) REFERENCES public.url(short_url) ON DELETE CASCADE;


--
-- TOC entry 4758 (class 2606 OID 16440)
-- Name: clicks clicks_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clicks
    ADD CONSTRAINT clicks_ibfk_2 FOREIGN KEY (username) REFERENCES public."user"(username) ON DELETE CASCADE;


-- Completed on 2025-06-23 18:52:05

--
-- PostgreSQL database dump complete
--

