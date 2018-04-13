package net.adshares.testsSetup;

import net.adshares.enums.Properties;
import net.adshares.pages.DashboardPopup;
import net.adshares.pages.LoginPage;
import net.adshares.pages.publisher.*;
import net.adshares.tools.Structure;
import net.adshares.tools.Xml;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.BeforeTest;

public class BrowserSetup {
    /**
     * System property defining location of ChromeDriver used by Selenium
     */
    private static final String SYS_PROP_WEBDRIVER_CHROME_DRIVER = "webdriver.chrome.driver";

    protected LoginPage loginPage;
    protected DashboardPopup dashboardPopup;
    protected PublisherNewSite publisherNewSite;
    protected PublisherMainPage publisherMainPage;
    protected SiteAdditionalTargeting siteAdditionalTargeting;
    protected SiteCreateAds siteCreateAds;
    protected SiteSummary siteSummary;

    public WebDriver driver;

    protected String loginAdService;
    protected String passwordAdService;
    protected String flag;

    @BeforeClass
    public void setChrome() {
        String property = System.getProperty(SYS_PROP_WEBDRIVER_CHROME_DRIVER);
        if (property == null || "".equals(property)) {
            System.setProperty(SYS_PROP_WEBDRIVER_CHROME_DRIVER, "C:\\chromedriver.exe");
        }
        ChromeOptions chromeOptions = new ChromeOptions();
        chromeOptions.addArguments("--start-maximized");
        // --kiosk is alternative for --start-maximized
//    chromeOptions.addArguments("--kiosk");
        driver = new ChromeDriver(chromeOptions);
//    driver.manage().window().maximize();
        driver.get("http://localhost:4200/");
    }

    @BeforeTest
    public void setUp() {
        final String DEFAULT_VALUE = "-";

        flag = DEFAULT_VALUE;
        loginAdService = Xml.getValue(Structure.CONFIG_PROPERTIES, Properties.PROPERTY, Properties.EMAIL);
        passwordAdService = Xml.getValue(Structure.CONFIG_PROPERTIES, Properties.PROPERTY, Properties.HASLO);
    }


    @AfterClass
    public void tearDown() {
//            driver.quit();
    }
}
