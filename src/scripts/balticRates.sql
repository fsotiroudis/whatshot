-- BalticRates query with vessel type specific routes
-- Parameters:
-- @dayDate: The date to filter from (format: 'YYYY-MM-DD')
-- @vesselType: The vessel type ('Tanker' or 'Dry')

DECLARE @dayDate DATE = '2025-04-01'; -- Default date, will be replaced by parameter
DECLARE @vesselType VARCHAR(10) = 'Tanker'; -- Default vessel type, will be replaced by parameter

SELECT 
    vc.VESSELTYPE,
    vc.VESSELCLASS,
    ROUTEID,
    RATEDATE,
    RATE
FROM DW_DATAMAX.DATA.BALTIC_RATES br
LEFT JOIN DW_DATAMAX.DATA.VESSEL_CLASSES vc ON br.VESSELCLASSID = vc.VESSELCLASSID
WHERE 
    VESSELTYPE = @vesselType
    AND ROUTEID = CASE 
        WHEN @vesselType = 'Tanker' THEN 'TD25'
        WHEN @vesselType = 'Dry' THEN 'C5'
        ELSE ROUTEID
    END
    AND RATEDATE >= @dayDate
ORDER BY 
    vc.VESSELTYPE,
    vc.VESSELCLASS,
    ROUTEID,
    RATEDATE; 