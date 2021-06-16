--desc: basic
SELECT
    SYSTOOLS.HTTPGETCLOB(
        URL => CAST('http://localhost:8088/dns/' CONCAT 'yahoo.com' AS VARCHAR(255)),
        HTTPHEADER => CAST(NULL AS CLOB(1K))) AS ADDR
    FROM SYSIBM.SYSDUMMY1;    
--desc: advanced (insert JSON_TABLE here)
select * from JSON_TABLE(SYSTOOLS.HTTPGETCLOB(                            
                            URL => CAST('http://localhost:8088/dns_adv/' CONCAT 
                              'yahoo.com' CONCAT 
                              '?dns_server=8.8.8.8' AS VARCHAR(255)),
                            HTTPHEADER => CAST(NULL AS CLOB(1K))),
  '$[*]' 
  COLUMNS ( ADDR VARCHAR(100) PATH 'lax $.address',
            TTL VARCHAR(100) PATH 'lax $.ttl',
            TYPE VARCHAR(100) PATH 'lax $.type') ERROR ON ERROR
  ) X
