package pl.adshares.adpanel.setup;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.remote.RemoteWebDriver;

import java.io.File;
import java.util.Objects;

public class DriverProvider {

  private static final String DRIVERS_DIRECTORY = "build/drivers";
  private static final String SYSTEM_PROP_WEBDRIVER_REMOTE = "webdriver.remote";
  private static final String SYSTEM_PROP_WEBDRIVER_REMOTE_URL = "webdriver.remote.url";
  private static final String SYSTEM_PROP_WEBDRIVER_CHROME_DRIVER = "webdriver.chrome.driver";
  private static final String WEBDRIVER_NAME_CHROME = "chromedriver";
  private static final String DEFAULT_WEBDRIVER_URL = "http://localhost:4444/wd/hub";
  private static WebDriver driver;

  private DriverProvider() {
  }

  public static File getWebDriverFile(String name) {
    File driversDir = new File(DRIVERS_DIRECTORY);
    if (!driversDir.exists()) {
      throw new RuntimeException("Cannot find web drivers directory: " + DRIVERS_DIRECTORY);
    }

    File driverFile = null;
    for (File file : Objects.requireNonNull(driversDir.listFiles())) {
      if (file.getName().startsWith(name) && !file.getName().endsWith(".version")) {
        driverFile = file;
        break;
      }
    }
    if (null == driverFile) {
      throw new RuntimeException("Cannot find web driver '" + name + "' in directory " + DRIVERS_DIRECTORY);
    }

    return driverFile;
  }

  static WebDriver getWebDriver() {
    if (driver == null) {

      ChromeOptions chromeOptions = new ChromeOptions();
      chromeOptions.addArguments("start-maximized");

      boolean useRemoteWebDriver = System.getProperty(SYSTEM_PROP_WEBDRIVER_REMOTE, "0").equals("1");

      if (useRemoteWebDriver) {
        try {

          String seleniumServerUrl = System.getProperty(SYSTEM_PROP_WEBDRIVER_REMOTE_URL, DEFAULT_WEBDRIVER_URL);
          driver = new RemoteWebDriver(new java.net.URL(seleniumServerUrl), chromeOptions);

        } catch (java.net.MalformedURLException $exception) {

          throw new RuntimeException($exception.getMessage());

        }
      } else {

        System.setProperty(SYSTEM_PROP_WEBDRIVER_CHROME_DRIVER, getWebDriverFile(WEBDRIVER_NAME_CHROME).getAbsolutePath());
        driver = new ChromeDriver(chromeOptions);

      }

      driver.get("http://panel.ads");
    }

    return driver;
  }

  static void close() {
    if (driver != null) {
      driver.quit();
      driver = null;
    }
  }
}
