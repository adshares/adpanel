package pl.adshares.adpanel.pages;

import org.openqa.selenium.WebDriver;

import org.openqa.selenium.opera.OperaDriver;
import org.openqa.selenium.opera.OperaOptions;
import org.openqa.selenium.support.PageFactory;


public class PageOpera {

//
//  public void OperaSecondTab() throws InterruptedException {
////    System.setProperty("webdriver.opera.driver", getWebDriverFile("chromedriver").getAbsolutePath());
//    OperaOptions operaOptions = new OperaOptions();
//    operaOptions.addArguments("--start-maximized");
//    driver = new OperaDriver(operaOptions);
//    driver.get("http://panel.ads");
////    String handle = driver.getWindowHandle();
////    System.out.println ("2.1. "+driver.getTitle()+" - "+handle);+
//    PageFactory.initElements(driver, this);
//    Thread.sleep(400000);
//  }
  public void operaTest(){
    WebDriver driver = new OperaDriver();
    driver.get("www.google.pl");

  }
}
