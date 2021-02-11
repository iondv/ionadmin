This page in [Russian](/README_RU.md)

# IONDV. Ionadmin

**Ionadmin** - is an IONDV. Framework module. It is used to manage tasks, such as setting up security in the system, creating scheduled tasks, backup copies of application data, starting recalculating semantics caches, editing and creating notifications.

### IONDV. Framework in brief

**IONDV. Framework** - is a node.js open source framework for developing accounting applications
or microservices based on metadata and individual modules. Framework is a part of 
instrumental digital platform to create enterprise 
(ERP) apps. This platform consists of the following open-source components: the [IONDV. Framework](https://github.com/iondv/framework), the
[modules](https://github.com/topics/iondv-module) and ready-made applications expanding it
functionality, visual development environment [Studio](https://github.com/iondv/studio) to create metadata for the app.

* For more details, see [IONDV. Framework site](https://iondv.com). 

* Documentation is available in the [Github repository](https://github.com/iondv/framework/blob/master/docs/en/index.md).

## Description

Access to the module, most commonly, is granted only to the user with system administrator rights. The module has several sections, each of which displays someone or other information necessary for work in the system. The user with administrator rights has access to every section, as well as the right to create and edit data on the sections.

## Module features 

- [x] **User access control** to the system with the appropriate roles assigned. Each role is determined by the availability of access rights to certain system resources. 

- [x] **Check for slow queries** to the database, which allows you to track and fix on time the long loading of objects in the system.

- [x] **Change Log** records all user actions performed on system objects.

- [x] **Data backup** allows you to avoid data loss in case of accidental error. Also, the launch of this functional can be configured on a schedule.

- [x] **Scheduled jobs** configured for system objects are displayed in the module section. It allows you to manage the schedule for any user who has access to the module.

- [x] **Security token generator** allows you to get the user key used to access the system using web-services. To get the key, you only need to enter the user login.

- [x] **Recalculation of semantics caches** allows you to update cached data about the semantics of objects in the system. Also, recalculation of semantics caches can be run on a schedule.

- [x] If **notifications** are configured for system objects, the system fixes the date of sending and text message. To quickly find the desired message, you can apply filters.
- 
- [x] **monitoring of key server resources** using the dashboard module.

## Intended use of the module using demo projects as an example

_Ionadmin_ module is used in several demo projects:
* [telecom-ru.iondv.com](https://telecom-ru.iondv.com/geomap) project (russian version), [telecom-en.iondv.com](https://telecom-en.iondv.com/geomap) project (english version).
* [pm-gov-ru.iondv.com](https://pm-gov-ru.iondv.com/geomap) project (only russian version).


--------------------------------------------------------------------------  


 #### [Licence](/LICENCE) &ensp;  [Contact us](https://iondv.com) &ensp;  [Russian](/README_RU.md)   &ensp; [FAQs](/faqs.md)          

<div><img src="https://mc.iondv.com/watch/local/docs/ionadmin" style="position:absolute; left:-9999px;" height=1 width=1 alt="iondv metrics"></div>

--------------------------------------------------------------------------  

Copyright (c) 2018 **LLC "ION DV"**.  
All rights reserved. 