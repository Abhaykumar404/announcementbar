import {
  Badge,
  BlockStack,
  Box,
  Button,
  Checkbox,
  InlineStack,
  Modal,
  Scrollable,
  TextField,
} from "@shopify/polaris";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const SelectCountriesModal = ({
  onSelect,
  selectedCountries = [],
  disabled = true,
}: {
  onSelect: (countries: string[]) => void;
  selectedCountries: string[];
  disabled: boolean;
}) => {
  // Get the list of countries as an array of [code, name] pairs
  const countries = Object.entries(getListOfCountries());

  const [open, setOpen] = useState(false);
  const [listOfSelectedCountries, setListOfSelectedCountries] =
    useState<string[]>(selectedCountries);
  const [searchValue, setSearchValue] = useState("");
  const [listOfFilteredCountries, setListOfFilteredCountries] =
    useState(countries);

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      activator={
        <Button onClick={() => setOpen(true)} fullWidth disabled={disabled}>
          Select countries
        </Button>
      }
      title="Select countries"
      footer={`Selected Countries: ${listOfSelectedCountries.length}`}
      primaryAction={{
        content: "Select",
        onAction: () => {
          onSelect(listOfSelectedCountries);

          setOpen(false);
        },
      }}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: () => {
            setOpen(false);
          },
        },
      ]}
    >
      <Modal.Section>
        <BlockStack gap="200">
          <TextField
            label="Country"
            labelHidden
            placeholder="Search for a country"
            value={searchValue}
            onChange={(value) => {
              setSearchValue(value);
              setListOfFilteredCountries(
                countries.filter(([key, countryName]) =>
                  countryName.toLowerCase().includes(value.toLowerCase())
                )
              );
            }}
            autoComplete="off"
          />

          <InlineStack gap="200">
            {listOfSelectedCountries.map((countryCode, index) => (
              <Badge key={index} tone="info">
                {getListOfCountries()[countryCode]}
              </Badge>
            ))}
          </InlineStack>

          <Scrollable shadow style={{ height: "400px" }}>
            <Box padding="200">
              <BlockStack gap="200">
                {listOfFilteredCountries.map(([key, value]) => (
                  <Checkbox
                    key={key}
                    label={value}
                    checked={listOfSelectedCountries.includes(key)}
                    onChange={() => {
                      if (listOfSelectedCountries.includes(key)) {
                        // Remove country if already selected
                        setListOfSelectedCountries(
                          listOfSelectedCountries.filter(
                            (country) => country !== key
                          )
                        );
                      } else {
                        // Add country if not already selected
                        setListOfSelectedCountries([
                          ...listOfSelectedCountries,
                          key,
                        ]);
                      }
                    }}
                  />
                ))}
              </BlockStack>
            </Box>
          </Scrollable>
        </BlockStack>
      </Modal.Section>
    </Modal>
  );
};

export default SelectCountriesModal;

const getListOfCountries = () => {
  return {
    AC: "🇦🇨 Ascension Island",
    AD: "🇦🇩 Andorra",
    AE: "🇦🇪 United Arab Emirates",
    AF: "🇦🇫 Afghanistan",
    AG: "🇦🇬 Antigua & Barbuda",
    AI: "🇦🇮 Anguilla",
    AL: "🇦🇱 Albania",
    AM: "🇦🇲 Armenia",
    AN: "🇳🇱 Netherlands Antilles",
    AO: "🇦🇴 Angola",
    AR: "🇦🇷 Argentina",
    AT: "🇦🇹 Austria",
    AU: "🇦🇺 Australia",
    AW: "🇦🇼 Aruba",
    AX: "🇦🇽 Åland Islands",
    AZ: "🇦🇿 Azerbaijan",
    BA: "🇧🇦 Bosnia & Herzegovina",
    BB: "🇧🇧 Barbados",
    BD: "🇧🇩 Bangladesh",
    BE: "🇧🇪 Belgium",
    BF: "🇧🇫 Burkina Faso",
    BG: "🇧🇬 Bulgaria",
    BH: "🇧🇭 Bahrain",
    BI: "🇧🇮 Burundi",
    BJ: "🇧🇯 Benin",
    BL: "🇧🇱 St. Barthélemy",
    BM: "🇧🇲 Bermuda",
    BN: "🇧🇳 Brunei",
    BO: "🇧🇴 Bolivia",
    BQ: "🇧🇶 Caribbean Netherlands",
    BR: "🇧🇷 Brazil",
    BS: "🇧🇸 Bahamas",
    BT: "🇧🇹 Bhutan",
    BV: "🇧🇻 Bouvet Island",
    BW: "🇧🇼 Botswana",
    BY: "🇧🇾 Belarus",
    BZ: "🇧🇿 Belize",
    CA: "🇨🇦 Canada",
    CC: "🇨🇨 Cocos (Keeling) Islands",
    CD: "🇨🇩 Congo - Kinshasa",
    CF: "🇨🇫 Central African Republic",
    CG: "🇨🇬 Congo - Brazzaville",
    CH: "🇨🇭 Switzerland",
    CI: "🇨🇮 Côte d’Ivoire",
    CK: "🇨🇰 Cook Islands",
    CL: "🇨🇱 Chile",
    CM: "🇨🇲 Cameroon",
    CN: "🇨🇳 China",
    CO: "🇨🇴 Colombia",
    CR: "🇨🇷 Costa Rica",
    CU: "🇨🇺 Cuba",
    CV: "🇨🇻 Cape Verde",
    CW: "🇨🇼 Curaçao",
    CX: "🇨🇽 Christmas Island",
    CY: "🇨🇾 Cyprus",
    CZ: "🇨🇿 Czechia",
    DE: "🇩🇪 Germany",
    DJ: "🇩🇯 Djibouti",
    DK: "🇩🇰 Denmark",
    DM: "🇩🇲 Dominica",
    DO: "🇩🇴 Dominican Republic",
    DZ: "🇩🇿 Algeria",
    EC: "🇪🇨 Ecuador",
    EE: "🇪🇪 Estonia",
    EG: "🇪🇬 Egypt",
    EH: "🇪🇭 Western Sahara",
    ER: "🇪🇷 Eritrea",
    ES: "🇪🇸 Spain",
    ET: "🇪🇹 Ethiopia",
    FI: "🇫🇮 Finland",
    FJ: "🇫🇯 Fiji",
    FK: "🇫🇰 Falkland Islands",
    FO: "🇫🇴 Faroe Islands",
    FR: "🇫🇷 France",
    GA: "🇬🇦 Gabon",
    GB: "🇬🇧 United Kingdom",
    GD: "🇬🇩 Grenada",
    GE: "🇬🇪 Georgia",
    GF: "🇬🇫 French Guiana",
    GG: "🇬🇬 Guernsey",
    GH: "🇬🇭 Ghana",
    GI: "🇬🇮 Gibraltar",
    GL: "🇬🇱 Greenland",
    GM: "🇬🇲 Gambia",
    GN: "🇬🇳 Guinea",
    GP: "🇬🇵 Guadeloupe",
    GQ: "🇬🇶 Equatorial Guinea",
    GR: "🇬🇷 Greece",
    GS: "🇬🇸 South Georgia & South Sandwich Islands",
    GT: "🇬🇹 Guatemala",
    GW: "🇬🇼 Guinea-Bissau",
    GY: "🇬🇾 Guyana",
    HK: "🇭🇰 Hong Kong SAR",
    HM: "🇭🇲 Heard & McDonald Islands",
    HN: "🇭🇳 Honduras",
    HR: "🇭🇷 Croatia",
    HT: "🇭🇹 Haiti",
    HU: "🇭🇺 Hungary",
    ID: "🇮🇩 Indonesia",
    IE: "🇮🇪 Ireland",
    IL: "🇮🇱 Israel",
    IM: "🇮🇲 Isle of Man",
    IN: "🇮🇳 India",
    IO: "🇮🇴 British Indian Ocean Territory",
    IQ: "🇮🇶 Iraq",
    IR: "🇮🇷 Iran",
    IS: "🇮🇸 Iceland",
    IT: "🇮🇹 Italy",
    JE: "🇯🇪 Jersey",
    JM: "🇯🇲 Jamaica",
    JO: "🇯🇴 Jordan",
    JP: "🇯🇵 Japan",
    KE: "🇰🇪 Kenya",
    KG: "🇰🇬 Kyrgyzstan",
    KH: "🇰🇭 Cambodia",
    KI: "🇰🇮 Kiribati",
    KM: "🇰🇲 Comoros",
    KN: "🇰🇳 St. Kitts & Nevis",
    KP: "🇰🇵 North Korea",
    KR: "🇰🇷 South Korea",
    KW: "🇰🇼 Kuwait",
    KY: "🇰🇾 Cayman Islands",
    KZ: "🇰🇿 Kazakhstan",
    LA: "🇱🇦 Laos",
    LB: "🇱🇧 Lebanon",
    LC: "🇱🇨 St. Lucia",
    LI: "🇱🇮 Liechtenstein",
    LK: "🇱🇰 Sri Lanka",
    LR: "🇱🇷 Liberia",
    LS: "🇱🇸 Lesotho",
    LT: "🇱🇹 Lithuania",
    LU: "🇱🇺 Luxembourg",
    LV: "🇱🇻 Latvia",
    LY: "🇱🇾 Libya",
    MA: "🇲🇦 Morocco",
    MC: "🇲🇨 Monaco",
    MD: "🇲🇩 Moldova",
    ME: "🇲🇪 Montenegro",
    MF: "🇲🇫 St. Martin",
    MG: "🇲🇬 Madagascar",
    MK: "🇲🇰 North Macedonia",
    ML: "🇲🇱 Mali",
    MM: "🇲🇲 Myanmar (Burma)",
    MN: "🇲🇳 Mongolia",
    MO: "🇲🇴 Macao SAR",
    MQ: "🇲🇶 Martinique",
    MR: "🇲🇷 Mauritania",
    MS: "🇲🇸 Montserrat",
    MT: "🇲🇹 Malta",
    MU: "🇲🇺 Mauritius",
    MV: "🇲🇻 Maldives",
    MW: "🇲🇼 Malawi",
    MX: "🇲🇽 Mexico",
    MY: "🇲🇾 Malaysia",
    MZ: "🇲🇿 Mozambique",
    NA: "🇳🇦 Namibia",
    NC: "🇳🇨 New Caledonia",
    NE: "🇳🇪 Niger",
    NF: "🇳🇫 Norfolk Island",
    NG: "🇳🇬 Nigeria",
    NI: "🇳🇮 Nicaragua",
    NL: "🇳🇱 Netherlands",
    NO: "🇳🇴 Norway",
    NP: "🇳🇵 Nepal",
    NR: "🇳🇷 Nauru",
    NU: "🇳🇺 Niue",
    NZ: "🇳🇿 New Zealand",
    OM: "🇴🇲 Oman",
    PA: "🇵🇦 Panama",
    PE: "🇵🇪 Peru",
    PF: "🇵🇫 French Polynesia",
    PG: "🇵🇬 Papua New Guinea",
    PH: "🇵🇭 Philippines",
    PK: "🇵🇰 Pakistan",
    PL: "🇵🇱 Poland",
    PM: "🇵🇲 St. Pierre & Miquelon",
    PN: "🇵🇳 Pitcairn Islands",
    PS: "🇵🇸 Palestinian Territories",
    PT: "🇵🇹 Portugal",
    PY: "🇵🇾 Paraguay",
    QA: "🇶🇦 Qatar",
    RE: "🇷🇪 Réunion",
    RO: "🇷🇴 Romania",
    RS: "🇷🇸 Serbia",
    RU: "🇷🇺 Russia",
    RW: "🇷🇼 Rwanda",
    SA: "🇸🇦 Saudi Arabia",
    SB: "🇸🇧 Solomon Islands",
    SC: "🇸🇨 Seychelles",
    SD: "🇸🇩 Sudan",
    SE: "🇸🇪 Sweden",
    SG: "🇸🇬 Singapore",
    SH: "🇸🇭 St. Helena",
    SI: "🇸🇮 Slovenia",
    SJ: "🇸🇯 Svalbard & Jan Mayen",
    SK: "🇸🇰 Slovakia",
    SL: "🇸🇱 Sierra Leone",
    SM: "🇸🇲 San Marino",
    SN: "🇸🇳 Senegal",
    SO: "🇸🇴 Somalia",
    SR: "🇸🇷 Suriname",
    SS: "🇸🇸 South Sudan",
    ST: "🇸🇹 São Tomé & Príncipe",
    SV: "🇸🇻 El Salvador",
    SX: "🇸🇽 Sint Maarten",
    SY: "🇸🇾 Syria",
    SZ: "🇸🇿 Eswatini",
    TA: "🇹🇦 Tristan da Cunha",
    TC: "🇹🇨 Turks & Caicos Islands",
    TD: "🇹🇩 Chad",
    TF: "🇹🇫 French Southern Territories",
    TG: "🇹🇬 Togo",
    TH: "🇹🇭 Thailand",
    TJ: "🇹🇯 Tajikistan",
    TK: "🇹🇰 Tokelau",
    TL: "🇹🇱 Timor-Leste",
    TM: "🇹🇲 Turkmenistan",
    TN: "🇹🇳 Tunisia",
    TO: "🇹🇴 Tonga",
    TR: "🇹🇷 Türkiye",
    TT: "🇹🇹 Trinidad & Tobago",
    TV: "🇹🇻 Tuvalu",
    TW: "🇹🇼 Taiwan",
    TZ: "🇹🇿 Tanzania",
    UA: "🇺🇦 Ukraine",
    UG: "🇺🇬 Uganda",
    UM: "🇺🇲 U.S. Outlying Islands",
    US: "🇺🇸 United States",
    UY: "🇺🇾 Uruguay",
    UZ: "🇺🇿 Uzbekistan",
    VA: "🇻🇦 Vatican City",
    VC: "🇻🇨 St. Vincent & Grenadines",
    VE: "🇻🇪 Venezuela",
    VG: "🇻🇬 British Virgin Islands",
    VI: "🇻🇮 U.S. Virgin Islands",
    VN: "🇻🇳 Vietnam",
    VU: "🇻🇺 Vanuatu",
    WF: "🇼🇫 Wallis & Futuna",
    WS: "🇼🇸 Samoa",
    YE: "🇾🇪 Yemen",
    YT: "🇾🇹 Mayotte",
    ZA: "🇿🇦 South Africa",
    ZM: "🇿🇲 Zambia",
    ZW: "🇿🇼 Zimbabwe",
  };
};
